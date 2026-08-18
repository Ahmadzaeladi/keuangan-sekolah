<?php

// Update web.php
$routes = file_get_contents(__DIR__ . '/routes/web.php');
$routes = str_replace(
    "Route::get('/students', [StudentController::class, 'index'])->name('students.index');",
    "Route::get('/students', [StudentController::class, 'index'])->name('students.index');\n    Route::get('/students/export', [StudentController::class, 'export'])->name('students.export');",
    $routes
);
$routes = str_replace(
    "Route::get('/finance/income', [FinanceController::class, 'income'])->name('finance.income');",
    "Route::get('/finance/income', [FinanceController::class, 'income'])->name('finance.income');\n    Route::get('/finance/income/export', [FinanceController::class, 'exportIncome'])->name('finance.income.export');",
    $routes
);
$routes = str_replace(
    "Route::get('/finance/expenses', [FinanceController::class, 'expenses'])->name('finance.expenses');",
    "Route::get('/finance/expenses', [FinanceController::class, 'expenses'])->name('finance.expenses');\n    Route::get('/finance/expenses/export', [FinanceController::class, 'exportExpenses'])->name('finance.expenses.export');",
    $routes
);
file_put_contents(__DIR__ . '/routes/web.php', $routes);


// Update StudentController.php
$studentController = file_get_contents(__DIR__ . '/app/Http/Controllers/StudentController.php');
$exportStudentMethod = <<<EOT
    public function export() {
        \$fileName = 'Data_Siswa_SIKOLA.csv';
        \$students = \App\Models\Student::with(['studentClass', 'guardian.user'])->get();

        \$headers = array(
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=\$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        );

        \$columns = ['NIS', 'NISN', 'Nama Siswa', 'Kelas', 'Jenis Kelamin', 'Agama', 'Alamat', 'Nama Wali', 'No Telp Wali', 'Email Wali'];

        \$callback = function() use(\$students, \$columns) {
            \$file = fopen('php://output', 'w');
            fputcsv(\$file, \$columns);
            foreach (\$students as \$s) {
                \$row = [
                    \$s->nis,
                    \$s->nisn,
                    \$s->name,
                    \$s->studentClass ? \$s->studentClass->name : '',
                    \$s->gender,
                    \$s->religion,
                    \$s->address,
                    \$s->guardian ? \$s->guardian->name : '',
                    \$s->guardian ? \$s->guardian->phone : '',
                    \$s->guardian && \$s->guardian->user ? \$s->guardian->user->email : '',
                ];
                fputcsv(\$file, \$row);
            }
            fclose(\$file);
        };
        return response()->stream(\$callback, 200, \$headers);
    }
EOT;
$studentController = str_replace('public function show(Student $student) {', $exportStudentMethod . "\n\n    public function show(Student \$student) {", $studentController);
file_put_contents(__DIR__ . '/app/Http/Controllers/StudentController.php', $studentController);


// Update FinanceController.php
$financeController = file_get_contents(__DIR__ . '/app/Http/Controllers/FinanceController.php');
$exportIncomeMethod = <<<EOT
    public function exportIncome() {
        \$fileName = 'Data_Pemasukan_SIKOLA.csv';
        \$incomes = Income::with('category')->latest()->get();
        \$headers = ["Content-type" => "text/csv", "Content-Disposition" => "attachment; filename=\$fileName", "Pragma" => "no-cache", "Cache-Control" => "must-revalidate, post-check=0, pre-check=0", "Expires" => "0"];
        \$columns = ['Tanggal', 'Kategori', 'Keterangan', 'Sumber', 'Nominal'];
        \$callback = function() use(\$incomes, \$columns) {
            \$file = fopen('php://output', 'w');
            fputcsv(\$file, \$columns);
            foreach (\$incomes as \$i) {
                fputcsv(\$file, [\$i->date, \$i->category ? \$i->category->name : '', \$i->description, \$i->source, \$i->amount]);
            }
            fclose(\$file);
        };
        return response()->stream(\$callback, 200, \$headers);
    }
EOT;
$exportExpenseMethod = <<<EOT
    public function exportExpenses() {
        \$fileName = 'Data_Pengeluaran_SIKOLA.csv';
        \$expenses = Expense::with('category')->latest()->get();
        \$headers = ["Content-type" => "text/csv", "Content-Disposition" => "attachment; filename=\$fileName", "Pragma" => "no-cache", "Cache-Control" => "must-revalidate, post-check=0, pre-check=0", "Expires" => "0"];
        \$columns = ['Tanggal', 'Kategori', 'Keterangan', 'Sumber', 'Nominal'];
        \$callback = function() use(\$expenses, \$columns) {
            \$file = fopen('php://output', 'w');
            fputcsv(\$file, \$columns);
            foreach (\$expenses as \$e) {
                fputcsv(\$file, [\$e->date, \$e->category ? \$e->category->name : '', \$e->description, \$e->source, \$e->amount]);
            }
            fclose(\$file);
        };
        return response()->stream(\$callback, 200, \$headers);
    }
EOT;
$financeController = str_replace('public function storeIncome(Request $request) {', $exportIncomeMethod . "\n\n    public function storeIncome(Request \$request) {", $financeController);
$financeController = str_replace('public function storeExpense(Request $request) {', $exportExpenseMethod . "\n\n    public function storeExpense(Request \$request) {", $financeController);
file_put_contents(__DIR__ . '/app/Http/Controllers/FinanceController.php', $financeController);


// Update Frontend UI
function injectExportButton($filePath, $buttonHtml, $targetStr) {
    $content = file_get_contents($filePath);
    $content = str_replace($targetStr, $buttonHtml . "\n                " . $targetStr, $content);
    file_put_contents($filePath, $content);
}

// Students/Index.tsx
injectExportButton(
    __DIR__ . '/resources/js/Pages/Students/Index.tsx',
    '<a href="/students/export" target="_blank" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium mr-3">Export Excel</a>',
    '<Link href="/students/create"'
);

// Finance/Income.tsx
injectExportButton(
    __DIR__ . '/resources/js/Pages/Finance/Income.tsx',
    '<a href="/finance/income/export" target="_blank" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium mr-3">Export Excel</a>',
    '<button onClick={() => setShowModal(true)}'
);

// Finance/Expenses.tsx
injectExportButton(
    __DIR__ . '/resources/js/Pages/Finance/Expenses.tsx',
    '<a href="/finance/expenses/export" target="_blank" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium mr-3">Export Excel</a>',
    '<button onClick={() => setShowModal(true)}'
);

echo "Export logic added to Students, Income, and Expenses.\n";
