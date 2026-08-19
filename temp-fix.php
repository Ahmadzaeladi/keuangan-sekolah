<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

foreach(\App\Models\Student::all() as $s) {
    \App\Models\User::updateOrCreate(
        ['username' => $s->nis],
        [
            'name' => $s->name,
            'email' => $s->nis . '@siswa.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'siswa'
        ]
    );
}
echo "Done";
