import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';

export default function Cash({ accounts, total }: any) {
    return (
        <DashboardLayout>
            <Head title="Pencatatan Kas" />
            <div className="max-w-container-max mx-auto space-y-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="font-display-lg text-primary">Pencatatan Kas</h2>
                        <p className="text-on-surface-variant">Total Saldo: <span className="font-bold text-primary">Rp {Number(total).toLocaleString('id-ID')}</span></p>
                    </div>
                </div>
                
                <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-outline-variant bg-surface-bright flex gap-4 justify-end">
                        <a href={route('finance.cash.export')} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">download</span> Export Buku Kas
                        </a>
                    </div>
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-surface-container-low border-b border-outline-variant text-tertiary-container text-label-md uppercase">
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Nama Akun</th>
                                    <th className="px-6 py-4 text-right">Saldo Saat Ini</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant">
                                {accounts?.map((acc: any) => (
                                    <tr key={acc.id} className="hover:bg-surface">
                                        <td className="px-6 py-4 text-on-surface-variant font-mono">{acc.id}</td>
                                        <td className="px-6 py-4 font-semibold">{acc.name}</td>
                                        <td className="px-6 py-4 text-right text-primary font-semibold">
                                            Rp {Number(acc.balance).toLocaleString('id-ID')}
                                        </td>
                                    </tr>
                                ))}
                                {(!accounts || accounts.length === 0) && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-center text-on-surface-variant">Tidak ada akun kas ditemukan.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}