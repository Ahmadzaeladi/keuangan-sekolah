<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
echo json_encode(\App\Models\User::where('id', 53)->orWhere('username', '2025001')->orWhere('email', '2025001@siswa.com')->get());
