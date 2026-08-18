import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent } from '@/Components/UI/Card';

export default function Show({ payment }: any) {
    const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    return (
        <DashboardLayout>
            <Head title={`Kwitansi - ${payment.payment_number}`} />
            <div className="max-w-2xl mx-auto">
                <Card className="p-8 mt-10">
                    <div className="text-center mb-8 border-b pb-4">
                        <h1 className="text-2xl font-bold text-blue-600 tracking-tight">SIKOLA</h1>
                        <p className="text-lg font-semibold mt-2">KWITANSI PEMBAYARAN</p>
                        <p className="text-slate-500">{payment.payment_number}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-y-4 text-sm text-slate-700 mb-8">
                        <div><p className="text-slate-500">Siswa:</p><p className="font-semibold text-base">{payment.student.name}</p></div>
                        <div><p className="text-slate-500">Kelas:</p><p className="font-semibold">{payment.student.student_class.name}</p></div>
                        <div className="col-span-2"><p className="text-slate-500">Tagihan:</p><p className="font-semibold">{payment.bill.bill_type.name} {payment.bill.period}</p></div>
                        <div><p className="text-slate-500">Nominal:</p><p className="font-semibold text-lg">{formatRp(payment.amount)}</p></div>
                        <div><p className="text-slate-500">Metode:</p><p className="font-semibold">{payment.payment_method}</p></div>
                        <div><p className="text-slate-500">Tanggal:</p><p className="font-semibold">{new Date(payment.paid_at).toLocaleDateString('id-ID')}</p></div>
                        <div><p className="text-slate-500">Status:</p><p className="font-bold text-green-600">✓ BERHASIL</p></div>
                    </div>
                    <div className="flex justify-center border-t pt-6">
                        <button onClick={() => window.print()} className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700">
                            Cetak Kwitansi
                        </button>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}