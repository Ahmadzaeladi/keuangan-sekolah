import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function PaymentHistory({ payments, filters }: any) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/reports/payments', { search }, { preserveState: true });
    };

    return (
        <DashboardLayout>
            <Head title="Histori Pembayaran" />
            <div className="max-w-container-max mx-auto w-full">
                <div className="flex justify-between items-end mb-6 mt-4 md:mt-8">
                    <div>
                        <h2 className="font-headline-lg text-headline-lg text-on-surface">Histori Pembayaran Siswa</h2>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-2">Log histori seluruh transaksi pembayaran SPP dan tagihan.</p>
                    </div>
                </div>

                <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-outline-variant bg-surface-bright flex flex-wrap gap-4 items-center justify-between">
                        <form onSubmit={handleSearch} className="relative w-full max-w-sm">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                            <input 
                                type="text"
                                placeholder="Cari NIS atau Nama Siswa..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary focus:ring-0 text-sm"
                            />
                        </form>
                        <a href={route('reports.payments.export', { search })} className="bg-surface-container-low border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-surface-container-high transition-colors">
                            <span className="material-symbols-outlined text-[20px]">download</span>
                            Export Excel
                        </a>
                    </div>
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Waktu</th>
                                    <th className="px-6 py-4">ID / Ref</th>
                                    <th className="px-6 py-4">Siswa</th>
                                    <th className="px-6 py-4">Tagihan</th>
                                    <th className="px-6 py-4 text-right">Nominal</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant">
                                {payments?.data?.map((p: any) => (
                                    <tr key={p.id} className="hover:bg-surface-container-lowest transition-colors">
                                        <td className="px-6 py-4 text-sm text-on-surface-variant">
                                            {new Date(p.paid_at || p.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono text-primary">{p.payment_number}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-on-surface">{p.student?.name}</div>
                                            <div className="text-xs text-on-surface-variant">{p.student?.nis} - {p.student?.student_class?.name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {p.bill?.bill_type?.name} ({p.bill?.period})
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-primary text-right">
                                            Rp {Number(p.amount).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {p.status === 'SUCCESS' ? (
                                                <span className="bg-primary-fixed text-on-primary-fixed px-2.5 py-1 rounded-full text-xs font-bold">SUKSES</span>
                                            ) : (
                                                <span className="bg-error-container text-error px-2.5 py-1 rounded-full text-xs font-bold">{p.status}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {(!payments?.data || payments.data.length === 0) && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                                            Tidak ada data histori pembayaran yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* Pagination Placeholder */}
                {payments?.links && (
                    <div className="flex justify-center mt-6 gap-2">
                        {payments.links.map((link: any, i: number) => (
                            <a 
                                key={i}
                                href={link.url || '#'}
                                className={`px-4 py-2 rounded-lg text-sm border ${link.active ? 'bg-primary text-on-primary border-primary' : 'bg-surface hover:bg-surface-container text-on-surface'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
