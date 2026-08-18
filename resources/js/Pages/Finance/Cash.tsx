import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';

export default function Cash() {
    return (
        <DashboardLayout>
            <Head title="Pencatatan Kas" />
            <div className="max-w-container-max mx-auto space-y-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="font-display-lg text-primary">Pencatatan Kas</h2>
                        <p className="text-on-surface-variant">Track income and expenses.</p>
                    </div>
                </div>
                
                <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-outline-variant bg-surface-bright flex gap-4">
                        <input className="flex-1 px-4 py-2 border border-outline-variant rounded-lg" placeholder="Search..." type="text" />
                        <button className="px-4 py-2 border border-outline-variant rounded-lg flex items-center">
                            <span className="material-symbols-outlined mr-2">filter_list</span>Filter
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-surface-container-low border-b border-outline-variant text-tertiary-container text-label-md uppercase">
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant">
                                <tr className="hover:bg-surface">
                                    <td className="px-6 py-4 text-on-surface-variant">Oct 24, 2023</td>
                                    <td className="px-6 py-4 font-semibold">SPP Payment - Grade 10A</td>
                                    <td className="px-6 py-4"><span className="px-2 py-1 rounded-full bg-primary-fixed text-xs">Income</span></td>
                                    <td className="px-6 py-4 text-right text-primary font-semibold">+ Rp 3.500.000</td>
                                </tr>
                                <tr className="hover:bg-surface bg-background">
                                    <td className="px-6 py-4 text-on-surface-variant">Oct 22, 2023</td>
                                    <td className="px-6 py-4 font-semibold">Library Books</td>
                                    <td className="px-6 py-4"><span className="px-2 py-1 rounded-full bg-error-container text-xs">Expense</span></td>
                                    <td className="px-6 py-4 text-right text-error font-semibold">- Rp 1.250.000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}