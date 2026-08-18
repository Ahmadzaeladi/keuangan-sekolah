<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
            'role_type' => ['required', 'in:siswa,staff'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        // Cari user berdasarkan username
        $user = \App\Models\User::where('username', $this->username)->first();

        // Validasi role selection matching (Siswa = guardian/student, Staff = admin/staff)
        // Disini kita cek jika dia pilih 'siswa' maka rolenya harus 'guardian' atau dia adalah siswa
        // Jika dia pilih 'staff' maka rolenya harus selain 'guardian' (misal: bendahara, admin, dll)
        if ($user) {
            $isSiswa = $user->role === 'guardian';
            $isStaff = in_array($user->role, ['bendahara', 'admin', 'staff']);
            
            if ($this->role_type === 'siswa' && !$isSiswa) {
                RateLimiter::hit($this->throttleKey());
                throw ValidationException::withMessages([
                    'role_mismatch' => 'Maaf, akun ini adalah akun Staff. Silakan login pada tab Staff.',
                ]);
            }
            if ($this->role_type === 'staff' && !$isStaff) {
                RateLimiter::hit($this->throttleKey());
                throw ValidationException::withMessages([
                    'role_mismatch' => 'Maaf, akun ini adalah akun Siswa/Wali. Silakan login pada tab Siswa.',
                ]);
            }
        }

        if (! Auth::attempt($this->only('username', 'password'), $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'username' => trans('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'username' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('username')).'|'.$this->ip());
    }
}
