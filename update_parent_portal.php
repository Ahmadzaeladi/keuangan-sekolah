<?php

$tsx = <<<EOT
import React, { useState, useMemo } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import ParentLayout from '@/Layouts/ParentLayout';
import { Card, CardContent } from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';

export default function Dashboard({ students, auth }: any) {
    const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    const [payBill, setPayBill] = useState<any>(null);
    const [filter, setFilter] = useState('ALL');
    const { post, processing } = useForm({ method: 'QRIS' });

    const handlePay = (e: any) => {
        e.preventDefault();
        post(`/parent/pay/\${payBill.id}`, {
            onSuccess: () => setPayBill(null)
        });
    };

    const translateStatus = (status: string) => {
        if (status === 'PAID') return 'Lunas';
        if (status === 'PARTIAL') return 'Sebagian';
        return 'Belum Lunas';
    };

    const getFilteredBills = (bills: any[]) => {
        if (filter === 'ALL') return bills;
        
        return bills.filter(b => {
            const date = new Date(b.due_date);
            const month = date.getMonth() + 1; // 1-12
            const year = date.getFullYear();
            const currentYear = new Date().getFullYear();

            if (filter === 'GANJIL') {
                return month >= 7 && month <= 12;
            }
            if (filter === 'GENAP') {
                return month >= 1 && month <= 6;
            }
            if (filter === 'TAHUN_INI') {
                return year === currentYear;
            }
            return true;
        });
    };

    return (
        <ParentLayout>
            <Head title="Portal Orang Tua" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Selamat pagi, {auth.user.name} 👋</h1>
            <p className="text-slate-500 mb-6">Pantau tagihan dan pembayaran anak Anda.</p>

            <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="text-sm font-medium text-slate-700">Tampilkan Tagihan:</label>
                <select value={filter} onChange={e => setFilter(e.target.value)} className="rounded-md border-slate-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 w-full sm:w-auto">
                    <option value="ALL">Semua Tagihan</option>
                    <option value="GANJIL">Semester Ganjil (Jul - Des)</option>
                    <option value="GENAP">Semester Genap (Jan - Jun)</option>
                    <option value="TAHUN_INI">Tahun Ini</option>
                </select>
            </div>

            {students.map((student: any) => {
                const filteredBills = getFilteredBills(student.bills);
                
                return (
                    <div key={student.id} className="mb-10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                                {student.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">{student.name}</h2>
                                <p className="text-sm text-slate-500">{student.student_class.name} • NIS: {student.nis}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {filteredBills.length === 0 ? (
                                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-slate-200">Tidak ada tagihan untuk periode ini.</div>
                            ) : filteredBills.map((b: any) => (
                                <Card key={b.id} className="overflow-hidden border-slate-200 shadow-sm">
                                    <CardContent className="p-4 sm:p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-bold text-slate-900">{b.bill_type.name}</h3>
                                                <p className="text-xs text-slate-500">{b.period}</p>
                                            </div>
                                            <Badge variant={b.status === 'PAID' ? 'success' : 'warning'}>{translateStatus(b.status)}</Badge>
                                        </div>
                                        <div className="flex justify-between items-end mt-4">
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Jatuh Tempo: {new Date(b.due_date).toLocaleDateString('id-ID')}</p>
                                                <p className="text-lg font-bold text-slate-900">{formatRp(b.amount)}</p>
                                            </div>
                                            <div>
                                                {b.status !== 'PAID' && (
                                                    <button onClick={() => setPayBill(b)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors">Bayar</button>
                                                )}
                                                {b.status === 'PAID' && (
                                                    <span className="text-slate-400 text-sm font-medium">Selesai</span>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                );
            })}

            {payBill && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md mx-4">
                        <div className="p-6">
                            <h2 className="text-lg font-bold mb-2">Simulasi Pembayaran</h2>
                            <p className="text-sm text-slate-500 mb-6">{payBill.bill_type.name} {payBill.period} - <strong className="text-slate-900">{formatRp(payBill.amount)}</strong></p>
                            <form onSubmit={handlePay}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Metode (Simulasi)</label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                                            <input type="radio" name="method" defaultChecked className="text-blue-600" />
                                            <span className="font-medium">QRIS</span>
                                        </label>
                                        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                                            <input type="radio" name="method" className="text-blue-600" />
                                            <span className="font-medium">Virtual Account / Transfer Bank</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setPayBill(null)} className="flex-1 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium border border-slate-200">Batal</button>
                                    <button type="submit" disabled={processing} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">{processing ? 'Memproses...' : 'Lanjutkan'}</button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            )}
        </ParentLayout>
    );
}
EOT;

file_put_contents(__DIR__ . '/resources/js/Pages/Parent/Dashboard.tsx', $tsx);
echo "Parent Dashboard updated with filter and translation.\n";
