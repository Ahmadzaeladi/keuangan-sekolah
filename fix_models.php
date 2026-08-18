<?php

$modelsDir = __DIR__ . '/app/Models';

function appendMethod($file, $methods) {
    global $modelsDir;
    $path = $modelsDir . '/' . $file . '.php';
    if (!file_exists($path)) return;
    $content = file_get_contents($path);
    // Remove closing brace
    $content = preg_replace('/}\s*$/', '', $content);
    $content .= "\n" . $methods . "\n}\n";
    file_put_contents($path, $content);
}

appendMethod('Income', "    public function category() { return \$this->belongsTo(IncomeCategory::class, 'income_category_id'); }");
appendMethod('Expense', "    public function category() { return \$this->belongsTo(ExpenseCategory::class, 'expense_category_id'); }");
appendMethod('Student', "    public function studentClass() { return \$this->belongsTo(StudentClass::class); }\n    public function guardian() { return \$this->belongsTo(Guardian::class); }\n    public function bills() { return \$this->hasMany(Bill::class); }\n    public function payments() { return \$this->hasMany(Payment::class); }");
appendMethod('Bill', "    public function student() { return \$this->belongsTo(Student::class); }\n    public function billType() { return \$this->belongsTo(BillType::class); }\n    public function academicYear() { return \$this->belongsTo(AcademicYear::class); }\n    public function payments() { return \$this->hasMany(Payment::class); }");
appendMethod('Payment', "    public function bill() { return \$this->belongsTo(Bill::class); }\n    public function student() { return \$this->belongsTo(Student::class); }");
appendMethod('Guardian', "    public function user() { return \$this->belongsTo(User::class); }\n    public function students() { return \$this->hasMany(Student::class); }");

$userPath = $modelsDir . '/User.php';
$userContent = file_get_contents($userPath);
$userContent = preg_replace('/}\s*$/', '', $userContent);
$userContent .= "\n    public function guardian() { return \$this->hasOne(Guardian::class); }\n}\n";
file_put_contents($userPath, $userContent);

echo "Relationships added.\n";
