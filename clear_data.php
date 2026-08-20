<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

DB::statement('SET FOREIGN_KEY_CHECKS=0;');
\App\Models\Income::truncate();
\App\Models\Expense::truncate();
\App\Models\Payment::truncate();
\App\Models\CashAccount::query()->update(['balance' => 0]);
\App\Models\Bill::query()->update(['status' => 'UNPAID']); // Set all bills to UNPAID since payments are cleared
DB::statement('SET FOREIGN_KEY_CHECKS=1;');

echo "Data cleared successfully.";
