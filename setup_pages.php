<?php
$pagesDir = __DIR__ . '/resources/js/Pages';
$dirs = ['Dashboard', 'Students', 'Bills', 'Payments', 'Finance', 'Arrears', 'Parent'];
foreach ($dirs as $d) {
    if (!is_dir($pagesDir . '/' . $d)) mkdir($pagesDir . '/' . $d, 0777, true);
}

// Dashboard
$dashboard = <<<EOT
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card';
import { Wallet, TrendingUp, TrendingDown, Users, AlertCircle } from 'lucide-react';
import { Badge } from '@/Components/UI/Badge';

export default function Dashboard({ stats, transactions }: any) {
    const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    
    return (
        <DashboardLayout>
            <Head title="Dashboard" />
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Ringkasan keuangan sekolah bulan ini</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Wallet className="w-6 h-6" /></div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Saldo Kas</p>
                                <p className="text-2xl font-bold text-slate-900">{formatRp(stats.saldo)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Pemasukan</p>
                                <p className="text-2xl font-bold text-slate-900">{formatRp(stats.pemasukan)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 text-red-600 rounded-lg"><TrendingDown className="w-6 h-6" /></div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Pengeluaran</p>
                                <p className="text-2xl font-bold text-slate-900">{formatRp(stats.pengeluaran)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><AlertCircle className="w-6 h-6" /></div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Tunggakan ({stats.siswaBelumBayar} Siswa)</p>
                                <p className="text-2xl font-bold text-slate-900">{formatRp(stats.tunggakan)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Transaksi Terbaru</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3">Tanggal</th>
                                    <th className="px-6 py-3">Kategori</th>
                                    <th className="px-6 py-3">Transaksi</th>
                                    <th className="px-6 py-3 text-right">Nominal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((t: any, i: number) => (
                                    <tr key={i} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-6 py-4">{new Date(t.date).toLocaleDateString('id-ID')}</td>
                                        <td className="px-6 py-4">{t.cat}</td>
                                        <td className="px-6 py-4">{t.desc}</td>
                                        <td className="px-6 py-4 text-right font-medium">
                                            <span className={t.type === 'in' ? 'text-green-600' : 'text-red-600'}>
                                                {t.type === 'in' ? '+' : '-'}{formatRp(t.amount)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}
EOT;
file_put_contents($pagesDir . '/Dashboard/Index.tsx', $dashboard);

// Students
$studentsIndex = <<<EOT
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent } from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';

export default function Index({ students }: any) {
    return (
        <DashboardLayout>
            <Head title="Data Siswa" />
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Data Siswa</h1>
            </div>
            <Card>
                <CardContent className="p-0">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3">NIS</th>
                                <th className="px-6 py-3">Nama</th>
                                <th className="px-6 py-3">Kelas</th>
                                <th className="px-6 py-3">Status Tagihan</th>
                                <th className="px-6 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.data.map((student: any) => (
                                <tr key={student.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4">{student.nis}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{student.name}</td>
                                    <td className="px-6 py-4">{student.student_class.name}</td>
                                    <td className="px-6 py-4">
                                        {student.bills.length > 0 ? (
                                            <Badge variant="danger">{student.bills.length} Belum Lunas</Badge>
                                        ) : (
                                            <Badge variant="success">Lunas</Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/students/\${student.id}`} className="text-blue-600 hover:underline">Detail</Link>
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
file_put_contents($pagesDir . '/Students/Index.tsx', $studentsIndex);

$studentsShow = <<<EOT
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';

export default function Show({ student, summary }: any) {
    const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    return (
        <DashboardLayout>
            <Head title={`Detail Siswa - \${student.name}`} />
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
EOT;
file_put_contents($pagesDir . '/Students/Show.tsx', $studentsShow);

// Payments (Index & Show)
$paymentsIndex = <<<EOT
import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent } from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';

export default function Index({ payments }: any) {
    const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    return (
        <DashboardLayout>
            <Head title="Pembayaran" />
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Pembayaran</h1>
                <Link href="/bills" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium">+ Catat Pembayaran</Link>
            </div>
            <Card>
                <CardContent className="p-0">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="bg-slate-50 border-b">
                            <tr><th className="px-6 py-3">ID</th><th className="px-6 py-3">Siswa</th><th className="px-6 py-3">Tagihan</th><th className="px-6 py-3">Nominal</th><th className="px-6 py-3">Tanggal</th><th className="px-6 py-3">Aksi</th></tr>
                        </thead>
                        <tbody>
                            {payments.data.map((p: any) => (
                                <tr key={p.id} className="border-b">
                                    <td className="px-6 py-4">{p.payment_number}</td>
                                    <td className="px-6 py-4">{p.student.name}</td>
                                    <td className="px-6 py-4">{p.bill.bill_type.name} - {p.bill.period}</td>
                                    <td className="px-6 py-4 font-medium text-green-600">{formatRp(p.amount)}</td>
                                    <td className="px-6 py-4">{new Date(p.paid_at).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4">
                                        <Link href={`/payments/\${p.id}`} className="text-blue-600 hover:underline">Kwitansi</Link>
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
file_put_contents($pagesDir . '/Payments/Index.tsx', $paymentsIndex);

$paymentsShow = <<<EOT
import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent } from '@/Components/UI/Card';

export default function Show({ payment }: any) {
    const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    return (
        <DashboardLayout>
            <Head title={`Kwitansi - \${payment.payment_number}`} />
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
EOT;
file_put_contents($pagesDir . '/Payments/Show.tsx', $paymentsShow);

// Bills Index
$billsIndex = <<<EOT
import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent } from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';

export default function Index({ bills }: any) {
    const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    const [selectedBill, setSelectedBill] = useState<any>(null);
    const { data, setData, post, processing, reset } = useForm({
        bill_id: '',
        amount: '',
        payment_method: 'QRIS',
        notes: ''
    });

    const openPayment = (bill: any) => {
        setSelectedBill(bill);
        setData({
            bill_id: bill.id,
            amount: bill.amount,
            payment_method: 'QRIS',
            notes: ''
        });
    };

    const submitPayment = (e: any) => {
        e.preventDefault();
        post('/payments', {
            onSuccess: () => {
                setSelectedBill(null);
                reset();
            }
        });
    };

    return (
        <DashboardLayout>
            <Head title="Tagihan" />
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Tagihan Siswa</h1>
            <Card>
                <CardContent className="p-0">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="bg-slate-50 border-b">
                            <tr><th className="px-6 py-3">Siswa</th><th className="px-6 py-3">Tagihan</th><th className="px-6 py-3">Periode</th><th className="px-6 py-3">Nominal</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Aksi</th></tr>
                        </thead>
                        <tbody>
                            {bills.data.map((b: any) => (
                                <tr key={b.id} className="border-b">
                                    <td className="px-6 py-4 font-medium text-slate-900">{b.student.name}</td>
                                    <td className="px-6 py-4">{b.bill_type.name}</td>
                                    <td className="px-6 py-4">{b.period}</td>
                                    <td className="px-6 py-4">{formatRp(b.amount)}</td>
                                    <td className="px-6 py-4"><Badge variant={b.status === 'PAID' ? 'success' : 'warning'}>{b.status}</Badge></td>
                                    <td className="px-6 py-4">
                                        {b.status !== 'PAID' && (
                                            <button onClick={() => openPayment(b)} className="text-blue-600 hover:underline font-medium">Bayar</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {selectedBill && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md">
                        <div className="p-6">
                            <h2 className="text-lg font-bold mb-4">Catat Pembayaran</h2>
                            <form onSubmit={submitPayment}>
                                <div className="mb-4">
                                    <p className="text-sm text-slate-500">Siswa</p>
                                    <p className="font-medium">{selectedBill.student.name}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="text-sm text-slate-500">Tagihan</p>
                                    <p className="font-medium">{selectedBill.bill_type.name} {selectedBill.period}</p>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nominal Pembayaran</label>
                                    <input type="number" value={data.amount} onChange={e => setData('amount', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Metode Pembayaran</label>
                                    <select value={data.payment_method} onChange={e => setData('payment_method', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                        <option value="CASH">Tunai</option>
                                        <option value="TRANSFER">Transfer Bank</option>
                                        <option value="QRIS">QRIS</option>
                                    </select>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setSelectedBill(null)} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-md">Batal</button>
                                    <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Simpan Pembayaran</button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            )}
        </DashboardLayout>
    );
}
EOT;
file_put_contents($pagesDir . '/Bills/Index.tsx', $billsIndex);

// Parent Dashboard
$parentDashboard = <<<EOT
import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import ParentLayout from '@/Layouts/ParentLayout';
import { Card, CardContent } from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';

export default function Dashboard({ students, auth }: any) {
    const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    const [payBill, setPayBill] = useState<any>(null);
    const { post, processing } = useForm({ method: 'QRIS' });

    const handlePay = (e: any) => {
        e.preventDefault();
        post(`/parent/pay/\${payBill.id}`, {
            onSuccess: () => setPayBill(null)
        });
    };

    return (
        <ParentLayout>
            <Head title="Portal Orang Tua" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Selamat pagi, {auth.user.name} 👋</h1>
            <p className="text-slate-500 mb-8">Pantau tagihan dan pembayaran anak Anda.</p>

            {students.map((student: any) => (
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
                    <Card>
                        <CardContent className="p-0">
                            <table className="w-full text-sm text-left text-slate-500">
                                <thead className="bg-slate-50 border-b">
                                    <tr><th className="px-6 py-3">Tagihan</th><th className="px-6 py-3">Jatuh Tempo</th><th className="px-6 py-3">Nominal</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Aksi</th></tr>
                                </thead>
                                <tbody>
                                    {student.bills.map((b: any) => (
                                        <tr key={b.id} className="border-b">
                                            <td className="px-6 py-4">{b.bill_type.name} {b.period}</td>
                                            <td className="px-6 py-4">{new Date(b.due_date).toLocaleDateString('id-ID')}</td>
                                            <td className="px-6 py-4 font-medium">{formatRp(b.amount)}</td>
                                            <td className="px-6 py-4"><Badge variant={b.status === 'PAID' ? 'success' : 'warning'}>{b.status}</Badge></td>
                                            <td className="px-6 py-4">
                                                {b.status !== 'PAID' && (
                                                    <button onClick={() => setPayBill(b)} className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-700">Bayar Sekarang</button>
                                                )}
                                                {b.status === 'PAID' && (
                                                    <Link href="/payments" className="text-slate-400 hover:text-slate-600 text-xs">Selesai</Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>
            ))}

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
file_put_contents($pagesDir . '/Parent/Dashboard.tsx', $parentDashboard);

echo "React pages generated.\n";
