import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';

export default function Show({ student, summary }: any) {
    const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    return (
        <DashboardLayout>
            <Head title={`Detail Siswa - ${student.name}`} />
            <div className="mb-6">
                <Link href="/students" className="text-sm text-blue-600 hover:underline mb-2 inline-block">← Kembali ke Data Siswa</Link>
                <h1 className="text-2xl font-bold text-slate-900">{student.name}</h1>
                <p className="text-slate-500">NIS: {student.nis} • Kelas: {student.student_class.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card><CardContent className="p-6"><p className="text-sm text-slate-500">Total Tagihan</p><p className="text-xl font-bold">{formatRp(summary.totalTagihan)}</p></CardContent></Card>
                <Card><CardContent className="p-6"><p className="text-sm text-slate-500">Sudah Dibayar</p><p className="text-xl font-bold text-green-600">{formatRp(summary.sudahDibayar)}</p></CardContent></Card>
                <Card><CardContent className="p-6"><p className="text-sm text-slate-500">Sisa Tagihan</p><p className="text-xl font-bold text-red-600">{formatRp(summary.sisaTagihan)}</p></CardContent></Card>
            </div>

            <Card className="mb-8">
                <CardHeader><CardTitle>Daftar Tagihan</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="bg-slate-50 border-b">
                            <tr><th className="px-6 py-3">Tagihan</th><th className="px-6 py-3">Periode</th><th className="px-6 py-3">Nominal</th><th className="px-6 py-3">Status</th></tr>
                        </thead>
                        <tbody>
                            {student.bills.map((b: any) => (
                                <tr key={b.id} className="border-b">
                                    <td className="px-6 py-4">{b.bill_type.name}</td>
                                    <td className="px-6 py-4">{b.period}</td>
                                    <td className="px-6 py-4">{formatRp(b.amount)}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={b.status === 'PAID' ? 'success' : 'warning'}>{b.status}</Badge>
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