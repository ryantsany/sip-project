<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\ResponseFormatter;

class ManageUserController extends Controller
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

    public function updateUser(Request $request, $nomor_induk)
    {
        $user = User::where('nomor_induk', $nomor_induk)->first();

        if(is_null($user)){
            return ResponseFormatter::error(404, null, [
                'User tidak ditemukan'
            ]);
        }

        $validator = Validator::make($request->all(),[
            'nama' => 'sometimes|required|string|max:255',
            'role' => 'sometimes|required|string|in:siswa,guru,admin,petugas',
            'kelas' => 'nullable|string|max:32',
        ]);

        if($validator->fails()){
            return ResponseFormatter::error(422, $validator->errors());
        }

        $payload = $validator->validated();

        $user->update($payload);

        return ResponseFormatter::success([
            'user' => $user,
        ], [
            'User berhasil diperbarui'
        ]);
    }

    public function deleteUser($nomor_induk)
    {
        $user = User::where('nomor_induk', $nomor_induk)->first();

        if(is_null($user)){
            return ResponseFormatter::error(404, null, [
                'User tidak ditemukan'
            ]);
        }

        $user->delete();

        return ResponseFormatter::success(null, [
            'User berhasil dihapus'
        ]);
    }

    public function listUsers()
    {
        $users = User::query()->paginate(6)->through(fn(User $user) => $user->api_response);

        return ResponseFormatter::success($users);
    }
    
    public function searchUsers(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'query' => 'required|string|max:255',
        ]);

        if($validator->fails()){
            return ResponseFormatter::error(422, $validator->errors());
        }

        $query = $request->input('query');

        $users = User::where('nama', 'like', '%' . $query . '%')
            ->orWhere('nomor_induk', 'like', '%' . $query . '%')
            ->paginate(6)
            ->through(fn(User $user) => $user->api_response);

        return ResponseFormatter::success($users);
    }
}
