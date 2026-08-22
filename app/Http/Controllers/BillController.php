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
        $allStudents = \App\Models\Student::where('status', 'ACTIVE')->orderBy('name')->get(['id', 'name', 'nis']);

        return Inertia::render('Bills/Index', [
            'bills' => $bills,
            'filters' => $request->only('search'),
            'classes' => $classes,
            'billTypes' => $billTypes,
            'academicYears' => $academicYears,
            'allStudents' => $allStudents
        ]);
    }

    public function bulkStore(Request $request) {
        $validated = $request->validate([
            'bill_type_id' => 'required|exists:bill_types,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'class_id' => 'nullable|exists:student_classes,id',
            'student_id' => 'nullable|exists:students,id',
            'period' => 'required_if:generate_mode,single|nullable|string',
            'amount' => 'required|numeric|min:1',
            'due_date' => 'required|date',
            'generate_mode' => 'nullable|in:single,semester1,semester2,year'
        ]);

        $studentQuery = \App\Models\Student::where('status', 'ACTIVE');
        if (!empty($validated['student_id'])) {
            $studentQuery->where('id', $validated['student_id']);
        } elseif (!empty($validated['class_id'])) {
            $studentQuery->where('student_class_id', $validated['class_id']);
        }
        
        $students = $studentQuery->pluck('id');
        if ($students->isEmpty()) {
            return back()->with('error', 'Tidak ada siswa yang sesuai untuk digenerate tagihannya.');
        }

        $generateMode = $request->input('generate_mode', 'single');
        $periods = [];
        
        if ($generateMode === 'semester1') {
            $months = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
            foreach ($months as $i => $m) {
                $periods[] = ['name' => $m, 'offset' => $i];
            }
        } elseif ($generateMode === 'semester2') {
            $months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];
            foreach ($months as $i => $m) {
                $periods[] = ['name' => $m, 'offset' => $i];
            }
        } elseif ($generateMode === 'year') {
            $months = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];
            foreach ($months as $i => $m) {
                $periods[] = ['name' => $m, 'offset' => $i];
            }
        } else {
            $periods[] = ['name' => $validated['period'], 'offset' => 0];
        }

        $bills = [];
        $now = now();
        $baseDueDate = \Carbon\Carbon::parse($validated['due_date']);
        
        // Fetch existing bills to prevent duplicates
        $existingBills = Bill::whereIn('student_id', $students)
            ->where('bill_type_id', $validated['bill_type_id'])
            ->where('academic_year_id', $validated['academic_year_id'])
            ->get(['student_id', 'period'])
            ->groupBy('student_id')
            ->map(function ($items) {
                return $items->pluck('period')->toArray();
            })
            ->toArray();

        foreach ($students as $studentId) {
            $studentExistingPeriods = $existingBills[$studentId] ?? [];
            
            foreach ($periods as $p) {
                // Skip if this period already exists for the student
                if (in_array($p['name'], $studentExistingPeriods)) {
                    continue;
                }
                
                $bills[] = [
                    'student_id' => $studentId,
                    'bill_type_id' => $validated['bill_type_id'],
                    'academic_year_id' => $validated['academic_year_id'],
                    'period' => $p['name'],
                    'amount' => $validated['amount'],
                    'due_date' => (clone $baseDueDate)->addMonthsNoOverflow($p['offset'])->format('Y-m-d'),
                    'status' => 'UNPAID',
                    'created_at' => $now,
                    'updated_at' => $now
                ];
            }
        }

        // Chunk insert to handle thousands of records safely
        foreach (array_chunk($bills, 500) as $chunk) {
            Bill::insert($chunk);
        }

        return back()->with('success', count($bills) . ' tagihan berhasil digenerate.');
    }

    public function destroy(Bill $bill) {
        if ($bill->status === 'PAID') {
            return back()->with('error', 'Tagihan yang sudah dibayar tidak dapat dihapus.');
        }
        $bill->delete();
        return back()->with('success', 'Tagihan berhasil dihapus.');
    }

    public function bulkDestroy(Request $request) {
        $validated = $request->validate([
            'bill_type_id' => 'required|exists:bill_types,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'class_id' => 'nullable|exists:student_classes,id',
        ]);

        $query = Bill::where('status', 'UNPAID')
            ->where('bill_type_id', $validated['bill_type_id'])
            ->where('academic_year_id', $validated['academic_year_id']);

        if (!empty($validated['class_id'])) {
            $query->whereHas('student', function ($q) use ($validated) {
                $q->where('student_class_id', $validated['class_id']);
            });
        }

        $count = $query->count();
        $query->delete();

        return back()->with('success', $count . ' tagihan belum lunas berhasil dihapus secara massal.');
    }
}