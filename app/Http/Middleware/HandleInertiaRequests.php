<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $userData = $user ? $user->toArray() : null;

        if ($user && $user->role === 'siswa') {
            $student = \App\Models\Student::with('studentClass')->where('nis', $user->username)->first();
            if ($student) {
                if ($student->studentClass) {
                    $userData['class_name'] = $student->studentClass->name;
                }
                $userData['photo'] = $student->photo ? asset('storage/' . $student->photo) : null;
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $userData,
            ],
        ];
    }
}
