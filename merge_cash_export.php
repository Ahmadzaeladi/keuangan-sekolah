<?php

// 1. Update web.php
$routes = file_get_contents(__DIR__ . '/routes/web.php');
// Remove the old separate routes
$routes = str_replace("Route::get('/finance/income/export', [FinanceController::class, 'exportIncome'])->name('finance.income.export');\n    ", "", $routes);
$routes = str_replace("Route::get('/finance/expenses/export', [FinanceController::class, 'exportExpenses'])->name('finance.expenses.export');\n    ", "", $routes);
// Add the new merged route under cash
$routes = str_replace(
    "Route::get('/finance/cash', [FinanceController::class, 'cash'])->name('finance.cash');",
    "Route::get('/finance/cash', [FinanceController::class, 'cash'])->name('finance.cash');\n    Route::get('/finance/cash/export', [FinanceController::class, 'exportCash'])->name('finance.cash.export');",
    $routes
);
file_put_contents(__DIR__ . '/routes/web.php', $routes);


// 2. Update FinanceController.php
$financeController = file_get_contents(__DIR__ . '/app/Http/Controllers/FinanceController.php');

// Remove old methods using regex
$financeController = preg_replace('/public function exportIncome\(\).*?\}\s*public function storeIncome/s', "public function storeIncome", $financeController);
$financeController = preg_replace('/public function exportExpenses\(\).*?\}\s*public function storeExpense/s', "public function storeExpense", $financeController);

// Add exportCash method
$exportCashMethod = <<<EOT
    public function exportCash() {
        \$fileName = 'Buku_Kas_SIKOLA.csv';
        \$incomes = Income::with('category')->get()->map(function(\$i) {
            \$i->type = 'Pemasukan';
            return \$i;
        });
        \$expenses = Expense::with('category')->get()->map(function(\$e) {
            \$e->type = 'Pengeluaran';
            return \$e;
        });
        
        \$merged = \$incomes->concat(\$expenses)->sortByDesc('date');

        \$headers = ["Content-type" => "text/csv", "Content-Disposition" => "attachment; filename=\$fileName", "Pragma" => "no-cache", "Cache-Control" => "must-revalidate, post-check=0, pre-check=0", "Expires" => "0"];
        \$columns = ['Tanggal', 'Jenis', 'Kategori', 'Keterangan', 'Sumber', 'Nominal (Rp)'];
        
        \$callback = function() use(\$merged, \$columns) {
            \$file = fopen('php://output', 'w');
            fputcsv(\$file, \$columns);
            foreach (\$merged as \$m) {
                fputcsv(\$file, [
                    \$m->date, 
                    \$m->type, 
                    \$m->category ? \$m->category->name : '', 
                    \$m->description, 
                    \$m->source, 
                    \$m->amount
                ]);
            }
            fclose(\$file);
        };
        return response()->stream(\$callback, 200, \$headers);
    }
EOT;

$financeController = str_replace('public function cash() {', $exportCashMethod . "\n\n    public function cash() {", $financeController);
file_put_contents(__DIR__ . '/app/Http/Controllers/FinanceController.php', $financeController);


// 3. Update Cash.tsx (Add Button)
$cashTsx = file_get_contents(__DIR__ . '/resources/js/Pages/Finance/Cash.tsx');
$cashTsx = str_replace(
    '<div className="mb-8">',
    '<div className="mb-8 flex justify-between items-start">',
    $cashTsx
);
$cashTsx = str_replace(
    '<p className="text-slate-500 mt-1">Saldo total: <span className="font-bold text-slate-900">{formatRp(total)}</span></p>
            </div>',
    '<p className="text-slate-500 mt-1">Saldo total: <span className="font-bold text-slate-900">{formatRp(total)}</span></p>
                </div>
                <a href="/finance/cash/export" target="_blank" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium">Export Buku Kas Excel</a>
            </div>',
    $cashTsx
);
file_put_contents(__DIR__ . '/resources/js/Pages/Finance/Cash.tsx', $cashTsx);


// 4. Update Income.tsx & Expenses.tsx (Remove Button)
$incomeTsx = file_get_contents(__DIR__ . '/resources/js/Pages/Finance/Income.tsx');
$incomeTsx = str_replace('<a href="/finance/income/export" target="_blank" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium mr-3">Export Excel</a>', '', $incomeTsx);
file_put_contents(__DIR__ . '/resources/js/Pages/Finance/Income.tsx', $incomeTsx);

$expenseTsx = file_get_contents(__DIR__ . '/resources/js/Pages/Finance/Expenses.tsx');
$expenseTsx = str_replace('<a href="/finance/expenses/export" target="_blank" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium mr-3">Export Excel</a>', '', $expenseTsx);
file_put_contents(__DIR__ . '/resources/js/Pages/Finance/Expenses.tsx', $expenseTsx);

echo "Export Kas unified successfully.\n";
