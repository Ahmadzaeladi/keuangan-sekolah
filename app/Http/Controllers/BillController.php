<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Bill;

class BillController extends Controller {
        public function index(Request $request) {
        $query = Bill::with(['student.studentClass', 'billType', 'academicYear'])->latest();
        
        if ($search = $request->query('search')) {
            $query->whereHas('student', function($q) use ($search) {
                $q->where('nis', 'like', "%$search%")
                  ->orWhere('name', 'like', "%$search%");
            });
        }

        $bills = $query->paginate(15)->withQueryString();
        
        // Data for Bulk Generator
        $classes = \App\Models\StudentClass::all();
        $billTypes = \App\Models\BillType::all();
        $academicYears = \App\Models\AcademicYear::where('is_active', true)->get();

        return Inertia::render('Bills/Index', [
            'bills' => $bills,
            'filters' => $request->only('search'),
            'classes' => $classes,
            'billTypes' => $billTypes,
            'academicYears' => $academicYears
        ]);
    }

    public function bulkStore(Request $request) {
        $validated = $request->validate([
            'bill_type_id' => 'required|exists:bill_types,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'class_id' => 'nullable|exists:student_classes,id',
            'period' => 'required|string',
            'amount' => 'required|numeric|min:1',
            'due_date' => 'required|date'
        ]);

        $studentQuery = \App\Models\Student::where('status', 'ACTIVE');
        if (!empty($validated['class_id'])) {
            $studentQuery->where('student_class_id', $validated['class_id']);
        }
        
        $students = $studentQuery->pluck('id');
        if ($students->isEmpty()) {
            return back()->with('error', 'Tidak ada siswa aktif di kelas tersebut.');
        }

        $bills = [];
        $now = now();
        foreach ($students as $studentId) {
            $bills[] = [
                'student_id' => $studentId,
                'bill_type_id' => $validated['bill_type_id'],
                'academic_year_id' => $validated['academic_year_id'],
                'period' => $validated['period'],
                'amount' => $validated['amount'],
                'due_date' => $validated['due_date'],
                'status' => 'UNPAID',
                'created_at' => $now,
                'updated_at' => $now
            ];
        }

        // Chunk insert to handle thousands of records safely
        foreach (array_chunk($bills, 500) as $chunk) {
            Bill::insert($chunk);
        }

        return back()->with('success', count($bills) . ' tagihan berhasil digenerate.');
    }
}