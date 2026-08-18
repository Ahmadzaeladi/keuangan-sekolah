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