<?php
$layoutsDir = __DIR__ . '/resources/js/Layouts';
$uiDir = __DIR__ . '/resources/js/Components/UI';
if (!is_dir($uiDir)) mkdir($uiDir, 0777, true);

// Dashboard Layout
$dashboardLayout = <<<EOT
import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, Users, CreditCard, Receipt, 
    Wallet, TrendingUp, TrendingDown, FileText, 
    Settings, LogOut, Menu, X, Bell, User as UserIcon
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { url } = usePage();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Pemasukan', href: '/finance/income', icon: TrendingUp, section: 'KEUANGAN' },
        { name: 'Pengeluaran', href: '/finance/expenses', icon: TrendingDown },
        { name: 'Kas', href: '/finance/cash', icon: Wallet },
        { name: 'Tagihan', href: '/bills', icon: Receipt, section: 'PEMBAYARAN' },
        { name: 'Pembayaran', href: '/payments', icon: CreditCard },
        { name: 'Tunggakan', href: '/arrears', icon: Bell },
        { name: 'Data Siswa', href: '/students', icon: Users, section: 'SISWA' },
        { name: 'Laporan Keuangan', href: '/reports/finance', icon: FileText, section: 'LAPORAN' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-16 shrink-0 items-center px-6 bg-slate-950">
                    <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        🏫 SIKOLA
                    </span>
                    <button className="ml-auto md:hidden" onClick={() => setSidebarOpen(false)}>
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
                <div className="px-6 py-4 text-sm font-medium text-slate-400 border-b border-slate-800">
                    SMA Negeri 1
                </div>
                <nav className="flex flex-1 flex-col px-4 py-4 overflow-y-auto">
                    <ul role="list" className="flex flex-1 flex-col gap-y-4">
                        {navigation.map((item, index) => (
                            <React.Fragment key={item.name}>
                                {item.section && (
                                    <div className="mt-4 text-xs font-semibold leading-6 text-slate-500 uppercase">
                                        {item.section}
                                    </div>
                                )}
                                <li>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            url.startsWith(item.href) ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800',
                                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors'
                                        )}
                                    >
                                        <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                                        {item.name}
                                    </Link>
                                </li>
                            </React.Fragment>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Main */}
            <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
                    <button type="button" className="-m-2.5 p-2.5 text-slate-700 md:hidden" onClick={() => setSidebarOpen(true)}>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end items-center">
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            <button type="button" className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-500">
                                <Bell className="h-6 w-6" aria-hidden="true" />
                            </button>
                            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200" aria-hidden="true" />
                            <div className="flex items-center gap-x-4">
                                <span className="hidden lg:flex lg:items-center">
                                    <span className="text-sm font-semibold leading-6 text-slate-900" aria-hidden="true">
                                        {user.name}
                                    </span>
                                </span>
                                <Link href={route('logout')} method="post" as="button" className="text-sm font-semibold leading-6 text-slate-500 hover:text-slate-700 flex items-center gap-2">
                                    <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
EOT;
file_put_contents($layoutsDir . '/DashboardLayout.tsx', $dashboardLayout);

// Parent Layout
$parentLayout = <<<EOT
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
EOT;
file_put_contents($layoutsDir . '/ParentLayout.tsx', $parentLayout);

// Card
$card = <<<EOT
import React from 'react';
import { cn } from '../../Layouts/DashboardLayout';

export function Card({ className, children }: { className?: string, children: React.ReactNode }) {
    return (
        <div className={cn("bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden", className)}>
            {children}
        </div>
    );
}
export function CardHeader({ className, children }: { className?: string, children: React.ReactNode }) {
    return <div className={cn("px-6 py-5 border-b border-slate-100", className)}>{children}</div>;
}
export function CardTitle({ className, children }: { className?: string, children: React.ReactNode }) {
    return <h3 className={cn("text-lg font-semibold leading-6 text-slate-900", className)}>{children}</h3>;
}
export function CardContent({ className, children }: { className?: string, children: React.ReactNode }) {
    return <div className={cn("px-6 py-5", className)}>{children}</div>;
}
EOT;
file_put_contents($uiDir . '/Card.tsx', $card);

// Badge
$badge = <<<EOT
import React from 'react';
import { cn } from '../../Layouts/DashboardLayout';

export function Badge({ className, variant = 'default', children }: { className?: string, variant?: 'default'|'success'|'danger'|'warning', children: React.ReactNode }) {
    const variants = {
        default: 'bg-slate-100 text-slate-700 border-slate-200',
        success: 'bg-green-50 text-green-700 border-green-200',
        danger: 'bg-red-50 text-red-700 border-red-200',
        warning: 'bg-amber-50 text-amber-700 border-amber-200',
    };
    return (
        <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset", variants[variant], className)}>
            {children}
        </span>
    );
}
EOT;
file_put_contents($uiDir . '/Badge.tsx', $badge);

echo "Layouts and UI components generated.\n";
