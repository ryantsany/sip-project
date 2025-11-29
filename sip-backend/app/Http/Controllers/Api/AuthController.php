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

    public function logout(Request $request){
        $user = $request->user();
        $user->currentAccessToken()->delete();

        return ResponseFormatter::success(null, [
            'Logout sukses'
        ]);
    }

    public function checkUserToken(Request $request){
        $user = $request->user();

        if($user){
            return ResponseFormatter::success([
                'user' => $user
            ]);
        }

        return ResponseFormatter::error(401, null, [
            'Invalid token'
        ]);
    }
}
