<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Student;

class StudentController extends Controller {
    public function index(\Illuminate\Http\Request $request) {
        $query = Student::with(['studentClass', 'guardian', 'bills' => function($q){
            $q->where('status', 'UNPAID');
        }]);

        if ($request->filled('class_id')) {
            $query->where('student_class_id', $request->class_id);
        }
        
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $students = $query->paginate(10)->withQueryString();
        $classes = \App\Models\StudentClass::all();

        return Inertia::render('Students/Index', [
            'students' => $students,
            'filters' => $request->only(['class_id', 'status']),
            'classes' => $classes
        ]);
    }

        public function export() {
        $fileName = 'Data_Siswa_SIKOLA.csv';
        $students = \App\Models\Student::with(['studentClass', 'guardian.user'])->get();

        $headers = array(
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        );

        $columns = ['NIS', 'NISN', 'Nama Siswa', 'Kelas', 'Jenis Kelamin', 'Agama', 'Alamat', 'Nama Wali', 'No Telp Wali', 'Email Wali'];

        $callback = function() use($students, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            foreach ($students as $s) {
                $row = [
                    $s->nis,
                    $s->nisn,
                    $s->name,
                    $s->studentClass ? $s->studentClass->name : '',
                    $s->gender,
                    $s->religion,
                    $s->address,
                    $s->guardian ? $s->guardian->name : '',
                    $s->guardian ? $s->guardian->phone : '',
                    $s->guardian && $s->guardian->user ? $s->guardian->user->email : '',
                ];
                fputcsv($file, $row);
            }
            fclose($file);
        };
        return response()->stream($callback, 200, $headers);
    }

    public function show(Student $student) {
        $student->load(['studentClass', 'guardian', 'bills.billType', 'payments']);
        
        $totalTagihan = $student->bills->sum('amount');
        $sudahDibayar = $student->payments->where('status', 'SUCCESS')->sum('amount');
        $sisaTagihan = $totalTagihan - $sudahDibayar;

        return Inertia::render('Students/Show', [
            'student' => $student,
            'summary' => compact('totalTagihan', 'sudahDibayar', 'sisaTagihan')
        ]);
    }

    public function create() {
        $classes = \App\Models\StudentClass::all();
        $guardians = \App\Models\Guardian::all();
        return Inertia::render('Students/Create', [
            'classes' => $classes,
            'guardians' => $guardians
        ]);
    }

    public function store(\Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'nis' => 'required|string|unique:students,nis',
            'nisn' => 'nullable|string|unique:students,nisn',
            'name' => 'required|string|max:255',
            'student_class_id' => 'required|exists:student_classes,id',
            'guardian_id' => 'required|exists:guardians,id',
            'gender' => 'required|in:L,P',
            'religion' => 'nullable|string',
            'birth_place' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'status' => 'required|in:ACTIVE,INACTIVE,GRADUATED',
            'photo' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('students', 'public');
        }

        $student = Student::create($validated);
        
        \App\Models\User::create([
            'name' => $student->name,
            'username' => $student->nis,
            'email' => $student->nis . '@siswa.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'siswa'
        ]);

        return redirect()->route('students.index')->with('success', 'Data siswa berhasil ditambahkan.');
    }

    public function edit(Student $student) {
        $classes = \App\Models\StudentClass::all();
        $guardians = \App\Models\Guardian::all();
        return Inertia::render('Students/Edit', [
            'student' => $student,
            'classes' => $classes,
            'guardians' => $guardians
        ]);
    }

    public function update(\Illuminate\Http\Request $request, Student $student) {
        $validated = $request->validate([
            'nis' => 'required|string|unique:students,nis,' . $student->id,
            'nisn' => 'nullable|string|unique:students,nisn,' . $student->id,
            'name' => 'required|string|max:255',
            'student_class_id' => 'required|exists:student_classes,id',
            'guardian_id' => 'required|exists:guardians,id',
            'gender' => 'required|in:L,P',
            'religion' => 'nullable|string',
            'birth_place' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'status' => 'required|in:ACTIVE,INACTIVE,GRADUATED',
            'photo' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('photo')) {
            if ($student->photo) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($student->photo);
            }
            $validated['photo'] = $request->file('photo')->store('students', 'public');
        } elseif ($request->boolean('remove_photo')) {
            if ($student->photo) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($student->photo);
            }
            $validated['photo'] = null;
        }

        $oldNis = $student->nis;
        $student->update($validated);

        $user = \App\Models\User::where('username', $oldNis)->first();
        if ($user) {
            $user->update([
                'name' => $student->name,
                'username' => $student->nis,
                'email' => $student->nis . '@siswa.com'
            ]);
        }

        return redirect()->route('students.index')->with('success', 'Data siswa berhasil diperbarui.');
    }

    public function promotion() {
        $classes = \App\Models\StudentClass::all();
        $students = Student::where('status', 'ACTIVE')->get();
        return Inertia::render('Students/Promotion', [
            'classes' => $classes,
            'students' => $students
        ]);
    }

    public function promote(\Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:students,id',
            'target_class_id' => 'required|string'
        ]);

        if ($validated['target_class_id'] === 'LULUS') {
            Student::whereIn('id', $validated['student_ids'])->update([
                'status' => 'GRADUATED'
            ]);
            return back()->with('success', count($validated['student_ids']) . ' siswa berhasil diluluskan.');
        } else {
            $request->validate(['target_class_id' => 'exists:student_classes,id']);
            Student::whereIn('id', $validated['student_ids'])->update([
                'student_class_id' => $validated['target_class_id']
            ]);
            return back()->with('success', count($validated['student_ids']) . ' siswa berhasil dipindahkan.');
        }
    }

    public function destroy(Student $student) {
        if ($student->photo) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($student->photo);
        }
        $student->delete();
        return redirect()->route('students.index')->with('success', 'Data siswa berhasil dihapus.');
    }
}