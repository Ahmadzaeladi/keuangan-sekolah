import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function Students({ students }: any) {
    return (
        <DashboardLayout>
            <Head title="Database Siswa" />
            <div className="max-w-container-max mx-auto w-full">
                <h2 className="font-headline-lg text-on-surface mb-6">Database Siswa</h2>
                <div className="bg-surface rounded-xl border p-6 mb-8 flex gap-4">
                    <select className="pl-4 pr-10 py-2 border rounded-lg appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231b1c19%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:12px_12px] bg-[right_16px_center]">
                        <option>Semua Kelas</option>
                    </select>
                    <select className="pl-4 pr-10 py-2 border rounded-lg appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231b1c19%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:12px_12px] bg-[right_16px_center]">
                        <option>Semua Status</option>
                    </select>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg">Filter</button>
                </div>
                <div className="bg-surface rounded-xl border overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-surface-container-low border-b">
                            <tr>
                                <th className="p-4">NIS</th>
                                <th className="p-4">Nama</th>
                                <th className="p-4">Kelas</th>
                                <th className="p-4">Tunggakan (Bills)</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {students?.data?.map((student: any) => (
                                <tr key={student.id} className="hover:bg-surface-container-lowest transition-colors">
                                    <td className="p-4 font-mono text-sm text-on-surface-variant">{student.nis}</td>
                                    <td className="p-4 font-semibold text-primary">{student.name}</td>
                                    <td className="p-4">{student.student_class?.name || '-'}</td>
                                    <td className="p-4 text-error font-medium">
                                        {student.bills?.length > 0 
                                            ? `Rp ${student.bills.reduce((acc: number, bill: any) => acc + Number(bill.amount), 0).toLocaleString('id-ID')}`
                                            : 'Rp 0'}
                                    </td>
                                    <td className="p-4">
                                        {student.bills?.length > 0 ? (
                                            <span className="bg-error-container text-error px-2 py-1 rounded-full text-xs font-bold">Tunggakan</span>
                                        ) : (
                                            <span className="bg-primary-fixed px-2 py-1 rounded-full text-xs font-bold text-on-primary-fixed">Lunas</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {(!students || !students.data || students.data.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-on-surface-variant">Tidak ada data siswa</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Placeholder */}
                {students?.links && (
                    <div className="flex justify-center mt-6 gap-2">
                        {students.links.map((link: any, i: number) => (
                            <Link 
                                key={i}
                                href={link.url || '#'}
                                className={`px-4 py-2 rounded-lg text-sm border ${link.active ? 'bg-primary text-white border-primary' : 'bg-surface hover:bg-surface-container'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}