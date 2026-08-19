<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class FixSiswaLogin extends Command
{
    protected $signature = 'fix:siswa-login';
    protected $description = 'Generate user login for all students based on their NIS.';

    public function handle()
    {
        $students = Student::all();
        $count = 0;
        foreach ($students as $student) {
            User::updateOrCreate(
                ['username' => $student->nis],
                [
                    'name' => $student->name,
                    'email' => $student->nis . '@siswa.test',
                    'password' => Hash::make('password'),
                    'role' => 'siswa'
                ]
            );
            $count++;
        }
        $this->info("Successfully created/updated $count siswa accounts.");
    }
}
