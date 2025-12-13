<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_and_get_token(){
        User::create([
            'nomor_induk' => '1313600015',
            'nama' => 'Wowo',
            'role' => 'siswa',
            'password' => bcrypt('password123'),
            'first_login' => false,
        ]);

        $response = $this->postJson('/api/login', [
            'nomor_induk' => '1313600015',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                    'meta' => [
                        'code',
                        'messages' =>[],
                        'validations',
                        'response_date'
                    ],
                    'data' => [
                        'redirect_url',
                        'token',
                    ],
                 ]);
    }

    public function test_authenticated_user_can_access_profile(){
        $user = User::create([
            'nomor_induk' => '1313600015',
            'nama' => 'Wowo',
            'role' => 'siswa',
            'password' => bcrypt('password123'),
            'first_login' => false,
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/profile');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                    'meta' => [
                        'code',
                        'messages' =>[],
                        'validations',
                        'response_date'
                    ],
                    'data' => [
                        'nomor_induk',
                        'nama',
                        'kelas',
                    ],
                 ]);
    }

    public function test_unauthenticated_user_cannot_access_profile(){
        $response = $this->getJson('/api/profile');

        $response->assertStatus(401)
                 ->assertJsonStructure([
                    'message',
                 ]);
    }

    public function test_siswa_cannot_get_all_users(){
        $user = User::create([
            'nomor_induk' => '1313600015',
            'nama' => 'Wowo',
            'role' => 'siswa',
            'password' => bcrypt('password123'),
            'first_login' => false,
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/users');

        $response->assertStatus(403)
                 ->assertJsonStructure([
                    'message',
                 ]);
    }

    public function test_logout_authenticated_user(){
        $user = User::create([
            'nomor_induk' => '1313600015',
            'nama' => 'Wowo',
            'role' => 'siswa',
            'password' => bcrypt('password123'),
            'first_login' => false,
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/logout');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                    'meta' => [
                        'code',
                        'messages' =>[],
                        'validations',
                        'response_date'
                    ],
                    'data',
                 ]);
    }
}
