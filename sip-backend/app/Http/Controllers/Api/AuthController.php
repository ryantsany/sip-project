<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\ResponseFormatter;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function addUser(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'nama' => 'required|string|max:255',
            'nomor_induk' => [
                'required',
                'string',
                'max:32',
                'unique:users',
                'regex:/^(13136\d{5}|181432\d{4})$/',
            ],
            'role' => 'required|string|in:siswa,guru,admin,petugas',
            'kelas' => 'nullable|string|max:32',
        ]);

        if($validator->fails()){
            return ResponseFormatter::error(422, $validator->errors());
        }

        $user = User::create([
            'nama' => $request->nama,
            'nomor_induk' => $request->nomor_induk,
            'role' => $request->role,
            'kelas' => $request->kelas,
        ]);

        return ResponseFormatter::success([
            'user' => $user,
        ], [
            'User berhasil dibuat'
        ]);
    }

    public function login(Request $request){
        $validator = Validator::make($request->all(),[
            'nomor_induk' => 'required|string|max:32',
        ]);

        if($validator->fails()){
            return ResponseFormatter::error(422, $validator->errors());
        }

        $user = User::where('nomor_induk', $request->nomor_induk)->first();

        if(is_null($user)){
            return ResponseFormatter::error(404, null, [
                'User tidak ditemukan'
            ]);
        }

        if(!$user->first_login){
            $validator = Validator::make($request->all(),[
                'nomor_induk' => 'required|string|max:32',
                'password' => 'required|string|min:8',
            ]);

            if($validator->fails()){
                return ResponseFormatter::error(422, $validator->errors());
            }

            if(Hash::check($request->password, $user->password)){
                $token = $user->createToken($user->nomor_induk)->plainTextToken;
                if($user->role == 'siswa' || $user->role == 'guru') {
                    return ResponseFormatter::success(['redirect_url' => config('app.frontend_url') . '/dashboard', 'token' => $token]);
                } else {
                    return ResponseFormatter::success(['redirect_url' => config('app.frontend_url') . '/admin', 'token' => $token]);
                }
            }

            return ResponseFormatter::error(401, null, [
                'Kredensial tidak valid'
            ]);
        }

        // return redirect(config('app.frontend_url') . '/first-login?nomor_induk=' . $request->nomor_induk);
        return ResponseFormatter::success(['redirect_url' => config('app.frontend_url') . '/first-login?nomor_induk=' . $request->nomor_induk]);
        
    }

    public function firstLogin(Request $request){
        $validator = Validator::make($request->all(),[
            'nomor_induk' => 'required|string|max:32',
            'password' => 'required|string|min:8',
            'password_confirmation' => 'required|string|same:password',
        ]);

        if($validator->fails()){
            return ResponseFormatter::error(422, $validator->errors(), [
                'Password dan konfirmasi password harus sama'
            ]);
        }

        $user = User::where('nomor_induk', $request->nomor_induk)->first();

        if(is_null($user)){
            return ResponseFormatter::error(404, null, [
                'User tidak ditemukan'
            ]);
        }

        if(!$user->first_login){
            return ResponseFormatter::error(400, null, [
                'Anda sudah membuat password, silahkan login seperti menggunakan password'
            ]);
        }

        $user->password = Hash::make($request->password);
        $user->first_login = false;
        $user->save();

        $token = $user->createToken($user->nomor_induk)->plainTextToken;

        return ResponseFormatter::success(['redirect_url' => config('app.frontend_url') . '/dashboard', 'token' => $token], [
            'Password berhasil dibuat'
        ]);
    }

    public function logout(Request $request){
        $user = $request->user();
        $user->currentAccessToken()->delete();

        return ResponseFormatter::success(null, [
            'Logout sukses'
        ]);
    }

    public function getProfile(Request $request){
        $user = $request->user();

        if($user){
            return ResponseFormatter::success( $user->api_response);
        }

        return ResponseFormatter::error(401, null, [
            'Invalid token'
        ]);
    }

    public function changePassword(Request $request){
        $validator = Validator::make($request->all(),[
            'current_password' => 'required|string|min:8',
            'new_password' => 'required|string|min:8|different:current_password',
            'new_password_confirmation' => 'required|string|same:new_password',
        ]);

        if($validator->fails()){
            return ResponseFormatter::error(422, $validator->errors());
        }

        $user = $request->user();

        if(!Hash::check($request->current_password, $user->password)){
            return ResponseFormatter::error(400, null, [
                'Password saat ini tidak valid'
            ]);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return ResponseFormatter::success(null, [
            'Password berhasil diubah'
        ]);
    }
}
