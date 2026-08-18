<?php
$pagesDir = __DIR__ . '/resources/js/Pages';
if (!is_dir($pagesDir . '/Reports')) mkdir($pagesDir . '/Reports', 0777, true);

// Finance - Income
$income = <<<EOT
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent } from '@/Components/UI/Card';

export default function Income({ incomes, total }: any) {
    const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    return (
        <DashboardLayout>
            <Head title="Pemasukan" />
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Pemasukan</h1>
                    <p className="text-slate-500 mt-1">Total: <span className="font-bold text-green-600">{formatRp(total)}</span></p>
                </div>
            </div>
            <Card>
                <CardContent className="p-0">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="bg-slate-50 border-b">
                            <tr><th className="px-6 py-3">Tanggal</th><th className="px-6 py-3">Kategori</th><th className="px-6 py-3">Keterangan</th><th className="px-6 py-3">Sumber</th><th className="px-6 py-3 text-right">Nominal</th></tr>
                        </thead>
                        <tbody>
                            {incomes.data.map((i: any) => (
                                <tr key={i.id} className="border-b">
                                    <td className="px-6 py-4">{new Date(i.date).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4">{i.category.name}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{i.description}</td>
                                    <td className="px-6 py-4">{i.source}</td>
                                    <td className="px-6 py-4 text-right font-medium text-green-600">{formatRp(i.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}
EOT;
file_put_contents($pagesDir . '/Finance/Income.tsx', $income);

// Finance - Expenses
$expenses = <<<EOT
import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent } from '@/Components/UI/Card';

export default function Expenses({ expenses, total }: any) {
    const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    return (
        <DashboardLayout>
            <Head title="Pengeluaran" />
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Pengeluaran</h1>
                    <p className="text-slate-500 mt-1">Total: <span className="font-bold text-red-600">{formatRp(total)}</span></p>
                </div>
            </div>
            <Card>
                <CardContent className="p-0">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="bg-slate-50 border-b">
                            <tr><th className="px-6 py-3">Tanggal</th><th className="px-6 py-3">Kategori</th><th className="px-6 py-3">Keterangan</th><th className="px-6 py-3 text-right">Nominal</th></tr>
                        </thead>
                        <tbody>
                            {expenses.data.map((e: any) => (
                                <tr key={e.id} className="border-b">
                                    <td className="px-6 py-4">{new Date(e.date).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4">{e.category.name}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{e.description}</td>
                                    <td className="px-6 py-4 text-right font-medium text-red-600">{formatRp(e.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}
EOT;
file_put_contents($pagesDir . '/Finance/Expenses.tsx', $expenses);

// Finance - Cash
$cash = <<<EOT
import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent } from '@/Components/UI/Card';
import { Wallet } from 'lucide-react';

export default function Cash({ accounts, total }: any) {
    const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    return (
        <DashboardLayout>
            <Head title="Kas" />
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Kas & Bank</h1>
                <p className="text-slate-500 mt-1">Saldo total: <span className="font-bold text-slate-900">{formatRp(total)}</span></p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {accounts.map((acc: any) => (
                    <Card key={acc.id}>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Wallet className="w-6 h-6" /></div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">{acc.name}</p>
                                    <p className="text-2xl font-bold text-slate-900">{formatRp(acc.balance)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </DashboardLayout>
    );
}
EOT;
file_put_contents($pagesDir . '/Finance/Cash.tsx', $cash);

// Arrears - Index
$arrears = <<<EOT
import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent } from '@/Components/UI/Card';

export default function Index({ arrears, total, count }: any) {
    const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    const [toast, setToast] = useState('');

    const sendReminder = (e: any) => {
        e.preventDefault();
        setToast('Pengingat berhasil dikirim.');
        setTimeout(() => setToast(''), 3000);
    };

    return (
        <DashboardLayout>
            <Head title="Tunggakan" />
            {toast && (
                <div className="fixed top-4 right-4 bg-slate-800 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
                    <span className="text-green-400">✓</span> {toast}
                </div>
            )}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Data Tunggakan</h1>
                <p className="text-slate-500 mt-1">Total Tunggakan: <span className="font-bold text-red-600">{formatRp(total)}</span> ({count} Siswa)</p>
            </div>
            <Card>
                <CardContent className="p-0">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="bg-slate-50 border-b">
                            <tr><th className="px-6 py-3">Siswa</th><th className="px-6 py-3">Kelas</th><th className="px-6 py-3">Tagihan</th><th className="px-6 py-3">Nominal Tunggakan</th><th className="px-6 py-3">Aksi</th></tr>
                        </thead>
                        <tbody>
                            {arrears.data.map((a: any) => (
                                <tr key={a.id} className="border-b">
                                    <td className="px-6 py-4 font-medium text-slate-900">{a.student.name}</td>
                                    <td className="px-6 py-4">{a.student.student_class.name}</td>
                                    <td className="px-6 py-4">{a.bill_type.name} - {a.period}</td>
                                    <td className="px-6 py-4 font-medium text-red-600">{formatRp(a.amount)}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={sendReminder} className="text-blue-600 hover:underline font-medium">Kirim Pengingat</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}
EOT;
file_put_contents($pagesDir . '/Arrears/Index.tsx', $arrears);

echo "Pages part 2 generated.\n";
