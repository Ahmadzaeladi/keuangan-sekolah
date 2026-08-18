<?php

// 1. Update web.php
$routes = file_get_contents(__DIR__ . '/routes/web.php');
$routes = str_replace(
    "Route::get('/students', [StudentController::class, 'index'])->name('students.index');",
    "Route::get('/students', [StudentController::class, 'index'])->name('students.index');\n    Route::get('/students/promotion', [StudentController::class, 'promotion'])->name('students.promotion');\n    Route::post('/students/promote', [StudentController::class, 'promote'])->name('students.promote');",
    $routes
);
$routes = str_replace(
    "Route::get('/bills', [BillController::class, 'index'])->name('bills.index');",
    "Route::get('/bills', [BillController::class, 'index'])->name('bills.index');\n    Route::post('/bills/bulk', [BillController::class, 'bulkStore'])->name('bills.bulkStore');",
    $routes
);
file_put_contents(__DIR__ . '/routes/web.php', $routes);


// 2. Update StudentController.php
$studentController = file_get_contents(__DIR__ . '/app/Http/Controllers/StudentController.php');
$promotionMethods = <<<EOT
    public function promotion() {
        \$classes = \App\Models\StudentClass::orderBy('level')->orderBy('name')->get();
        \$students = \App\Models\Student::with('studentClass')->where('status', 'ACTIVE')->orderBy('name')->get();
        return Inertia::render('Students/Promotion', [
            'classes' => \$classes,
            'students' => \$students
        ]);
    }

    public function promote(Request \$request) {
        \$validated = \$request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:students,id',
            'target_class_id' => 'required|exists:student_classes,id'
        ]);

        \App\Models\Student::whereIn('id', \$validated['student_ids'])
            ->update(['student_class_id' => \$validated['target_class_id']]);

        return back()->with('success', count(\$validated['student_ids']) . ' siswa berhasil dipindahkan.');
    }
EOT;
$studentController = str_replace('public function index(Request $request) {', $promotionMethods . "\n\n    public function index(Request \$request) {", $studentController);
file_put_contents(__DIR__ . '/app/Http/Controllers/StudentController.php', $studentController);


// 3. Update BillController.php
$billController = file_get_contents(__DIR__ . '/app/Http/Controllers/BillController.php');
$billIndexParams = <<<EOT
    public function index(Request \$request) {
        \$query = Bill::with(['student.studentClass', 'billType', 'academicYear'])->latest();
        
        if (\$search = \$request->query('search')) {
            \$query->whereHas('student', function(\$q) use (\$search) {
                \$q->where('nis', 'like', "%\$search%")
                  ->orWhere('name', 'like', "%\$search%");
            });
        }

        \$bills = \$query->paginate(15)->withQueryString();
        
        // Data for Bulk Generator
        \$classes = \App\Models\StudentClass::all();
        \$billTypes = \App\Models\BillType::all();
        \$academicYears = \App\Models\AcademicYear::where('is_active', true)->get();

        return Inertia::render('Bills/Index', [
            'bills' => \$bills,
            'filters' => \$request->only('search'),
            'classes' => \$classes,
            'billTypes' => \$billTypes,
            'academicYears' => \$academicYears
        ]);
    }

    public function bulkStore(Request \$request) {
        \$validated = \$request->validate([
            'bill_type_id' => 'required|exists:bill_types,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'class_id' => 'nullable|exists:student_classes,id',
            'period' => 'required|string',
            'amount' => 'required|numeric|min:1',
            'due_date' => 'required|date'
        ]);

        \$studentQuery = \App\Models\Student::where('status', 'ACTIVE');
        if (!empty(\$validated['class_id'])) {
            \$studentQuery->where('student_class_id', \$validated['class_id']);
        }
        
        \$students = \$studentQuery->pluck('id');
        if (\$students->isEmpty()) {
            return back()->with('error', 'Tidak ada siswa aktif di kelas tersebut.');
        }

        \$bills = [];
        \$now = now();
        foreach (\$students as \$studentId) {
            \$bills[] = [
                'student_id' => \$studentId,
                'bill_type_id' => \$validated['bill_type_id'],
                'academic_year_id' => \$validated['academic_year_id'],
                'period' => \$validated['period'],
                'amount' => \$validated['amount'],
                'due_date' => \$validated['due_date'],
                'status' => 'UNPAID',
                'created_at' => \$now,
                'updated_at' => \$now
            ];
        }

        // Chunk insert to handle thousands of records safely
        foreach (array_chunk(\$bills, 500) as \$chunk) {
            Bill::insert(\$chunk);
        }

        return back()->with('success', count(\$bills) . ' tagihan berhasil digenerate.');
    }
EOT;
$billController = preg_replace('/public function index\(Request \$request\) \{.*?\n    \}/s', $billIndexParams, $billController);
file_put_contents(__DIR__ . '/app/Http/Controllers/BillController.php', $billController);

echo "Controllers updated successfully.\n";
