import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { cn } from './DashboardLayout';

export default function ParentLayout({ children }: { children: React.ReactNode }) {
    const user = usePage().props.auth.user;

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold tracking-tight text-blue-600">🏫 SIKOLA</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-slate-700">
                                <UserIcon className="w-5 h-5 text-slate-400" />
                                <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                            </div>
                            <div className="h-4 w-px bg-slate-300"></div>
                            <Link href={route('logout')} method="post" as="button" className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1">
                                <LogOut className="w-4 h-4" /> <span className="hidden sm:block">Keluar</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}