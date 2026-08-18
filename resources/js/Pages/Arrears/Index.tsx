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