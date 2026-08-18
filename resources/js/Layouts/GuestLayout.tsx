import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center islamic-pattern p-4">
            <div className="w-full sm:max-w-md bg-surface border border-outline-variant rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
                <div className="px-8 py-10 flex flex-col flex-1">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-on-primary mb-4 shadow-sm">
                            <span className="material-symbols-outlined text-[28px]">
                                mosque
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-on-surface text-center">
                            Ponpes Darul Kurnia Cendekia
                        </h1>
                        <p className="text-sm text-on-surface-variant mt-1">
                            Sistem Informasi Akademik & Keuangan
                        </p>
                    </div>

                    <div className="flex-1 w-full">{children}</div>
                </div>

                <div className="bg-surface-container-lowest border-t border-outline-variant py-4 px-8 text-center mt-auto">
                    <p className="text-xs text-on-surface-variant"></p>
                </div>
            </div>
        </div>
    );
}
