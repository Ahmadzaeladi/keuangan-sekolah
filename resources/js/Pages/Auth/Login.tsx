import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
        role_type: "siswa", // default 'siswa'
        remember: false as boolean,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-primary">
                    {status}
                </div>
            )}

            {(errors as any).role_mismatch && (
                <div className="mb-6 p-4 bg-error-container text-error rounded-xl text-sm font-bold flex items-start gap-3 shadow-sm border border-error/20">
                    <span className="material-symbols-outlined mt-0.5">
                        error
                    </span>
                    <p>{(errors as any).role_mismatch}</p>
                </div>
            )}

            {/* Segmented Control */}
            <div className="bg-surface-container-low p-1 rounded-lg flex mb-6">
                <button
                    type="button"
                    onClick={() => setData("role_type", "siswa")}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                        data.role_type === "siswa"
                            ? "bg-surface text-on-surface shadow-sm"
                            : "text-on-surface-variant hover:text-on-surface"
                    }`}
                >
                    Orang Tua / Siswa
                </button>
                <button
                    type="button"
                    onClick={() => setData("role_type", "staff")}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                        data.role_type === "staff"
                            ? "bg-surface text-on-surface shadow-sm"
                            : "text-on-surface-variant hover:text-on-surface"
                    }`}
                >
                    Staff
                </button>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-5">
                <div>
                    <label
                        htmlFor="username"
                        className="block text-xs font-bold text-on-surface-variant mb-1.5"
                    >
                        {data.role_type === "siswa"
                            ? "Nomor Induk Siswa (NIS)"
                            : "Nomor Induk Pegawai (NIP)"}
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                            <span className="material-symbols-outlined text-[20px]">
                                badge
                            </span>
                        </div>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={data.username}
                            className="block w-full pl-10 pr-3 py-2.5 border border-outline-variant rounded-lg bg-surface text-sm focus:ring-primary focus:border-primary transition-colors"
                            placeholder={
                                data.role_type === "siswa"
                                    ? "Masukkan NIS Anda"
                                    : "Masukkan NIP Anda"
                            }
                            autoComplete="username"
                            required
                            onChange={(e) =>
                                setData("username", e.target.value)
                            }
                        />
                    </div>
                    <InputError message={errors.username} className="mt-1" />
                </div>

                <div>
                    <div className="flex justify-between items-end mb-1.5">
                        <label
                            htmlFor="password"
                            className="block text-xs font-bold text-on-surface-variant"
                        >
                            Password
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="text-xs font-bold text-primary hover:text-primary-fixed transition-colors"
                            >
                                Lupa Password?
                            </Link>
                        )}
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                            <span className="material-symbols-outlined text-[20px]">
                                lock
                            </span>
                        </div>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            className="block w-full pl-10 pr-10 py-2.5 border border-outline-variant rounded-lg bg-surface text-sm focus:ring-primary focus:border-primary transition-colors"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface focus:outline-none"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {showPassword ? "visibility_off" : "visibility"}
                            </span>
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div className="hidden">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="mt-2 w-full flex items-center justify-center py-2.5 px-4 bg-primary text-on-primary rounded-lg text-sm font-bold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    Masuk{" "}
                    <span className="material-symbols-outlined text-[18px] ml-1.5">
                        arrow_forward
                    </span>
                </button>
            </form>
        </GuestLayout>
    );
}
