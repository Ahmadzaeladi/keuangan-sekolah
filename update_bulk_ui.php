<?php

// 1. Create Promotion.tsx
$promotionTsx = <<<EOT
import React, { useState, useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent } from '@/Components/UI/Card';

export default function Promotion({ classes, students }: any) {
    const [sourceClass, setSourceClass] = useState('');
    const [targetClass, setTargetClass] = useState('');
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    
    const { post, processing, data, setData } = useForm({
        student_ids: [] as number[],
        target_class_id: ''
    });

    const sourceStudents = useMemo(() => {
        if (!sourceClass) return [];
        return students.filter((s: any) => s.student_class_id.toString() === sourceClass);
    }, [sourceClass, students]);

    const handleSelectAll = (e: any) => {
        if (e.target.checked) {
            setSelectedStudents(sourceStudents.map((s: any) => s.id));
        } else {
            setSelectedStudents([]);
        }
    };

    const handleSelectStudent = (id: number) => {
        if (selectedStudents.includes(id)) {
            setSelectedStudents(selectedStudents.filter(sid => sid !== id));
        } else {
            setSelectedStudents([...selectedStudents, id]);
        }
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setData({ student_ids: selectedStudents, target_class_id: targetClass });
        // The post will happen in a useEffect or we can just do an inline post
        post('/students/promote', {
            data: { student_ids: selectedStudents, target_class_id: targetClass },
            onSuccess: () => {
                setSelectedStudents([]);
                setSourceClass('');
                setTargetClass('');
            }
        });
    };

    return (
        <DashboardLayout>
            <Head title="Kenaikan Kelas" />
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Kenaikan Kelas / Mutasi</h1>
                <p className="text-slate-500 mt-1">Pindahkan siswa secara massal ke kelas baru.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <div className="p-4 border-b bg-slate-50">
                            <h2 className="font-bold text-slate-900 mb-3">1. Pilih Kelas Asal</h2>
                            <select value={sourceClass} onChange={e => { setSourceClass(e.target.value); setSelectedStudents([]); }} className="w-full rounded-md border-slate-300">
                                <option value="">-- Pilih Kelas --</option>
                                {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <CardContent className="p-0">
                            <div className="h-96 overflow-y-auto">
                                {sourceClass ? (
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-100 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-3 w-10">
                                                    <input type="checkbox" onChange={handleSelectAll} checked={selectedStudents.length === sourceStudents.length && sourceStudents.length > 0} className="rounded border-slate-300" />
                                                </th>
                                                <th className="px-4 py-3">NIS</th>
                                                <th className="px-4 py-3">Nama Siswa</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sourceStudents.map((s: any) => (
                                                <tr key={s.id} className="border-b hover:bg-slate-50">
                                                    <td className="px-4 py-3">
                                                        <input type="checkbox" checked={selectedStudents.includes(s.id)} onChange={() => handleSelectStudent(s.id)} className="rounded border-slate-300" />
                                                    </td>
                                                    <td className="px-4 py-3">{s.nis}</td>
                                                    <td className="px-4 py-3 font-medium">{s.name}</td>
                                                </tr>
                                            ))}
                                            {sourceStudents.length === 0 && (
                                                <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-500">Tidak ada siswa di kelas ini.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400">Pilih kelas asal terlebih dahulu.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <div className="p-4 border-b bg-blue-50">
                            <h2 className="font-bold text-blue-900 mb-3">2. Pilih Kelas Tujuan</h2>
                            <select value={targetClass} onChange={e => setTargetClass(e.target.value)} required className="w-full rounded-md border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                                <option value="">-- Pilih Kelas Tujuan --</option>
                                {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <CardContent className="p-6">
                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-6 text-center">
                                <p className="text-4xl font-bold text-blue-600 mb-2">{selectedStudents.length}</p>
                                <p className="text-sm font-medium text-slate-600">Siswa Terpilih</p>
                            </div>
                            
                            <button type="submit" disabled={processing || selectedStudents.length === 0 || !targetClass} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                Pindahkan {selectedStudents.length} Siswa Sekarang
                            </button>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </DashboardLayout>
    );
}
EOT;
file_put_contents(__DIR__ . '/resources/js/Pages/Students/Promotion.tsx', $promotionTsx);


// 2. Update DashboardLayout.tsx (Menu Link)
$layoutPath = __DIR__ . '/resources/js/Layouts/DashboardLayout.tsx';
$layoutTsx = file_get_contents($layoutPath);
$layoutTsx = str_replace(
    '<Link href="/students" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${url.startsWith(\'/students\') ? \'bg-blue-50 text-blue-700 font-medium\' : \'text-slate-600 hover:bg-slate-50 hover:text-slate-900\'}`}>',
    '<Link href="/students" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${url === \'/students\' ? \'bg-blue-50 text-blue-700 font-medium\' : \'text-slate-600 hover:bg-slate-50 hover:text-slate-900\'}`}>',
    $layoutTsx
);
$layoutTsx = str_replace(
    '<Link href="/students" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${url === \'/students\' ? \'bg-blue-50 text-blue-700 font-medium\' : \'text-slate-600 hover:bg-slate-50 hover:text-slate-900\'}`}>
                            <Users className="w-5 h-5" /> Data Siswa
                        </Link>',
    '<Link href="/students" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${url === \'/students\' ? \'bg-blue-50 text-blue-700 font-medium\' : \'text-slate-600 hover:bg-slate-50 hover:text-slate-900\'}`}>
                            <Users className="w-5 h-5" /> Data Siswa
                        </Link>
                        <Link href="/students/promotion" className={`flex items-center gap-3 px-3 py-2 ml-4 rounded-md transition-colors text-sm ${url.startsWith(\'/students/promotion\') ? \'bg-blue-50 text-blue-700 font-medium\' : \'text-slate-600 hover:bg-slate-50 hover:text-slate-900\'}`}>
                            <span className="w-5 h-5 text-center flex items-center justify-center">↳</span> Kenaikan Kelas
                        </Link>',
    $layoutTsx
);
file_put_contents($layoutPath, $layoutTsx);


// 3. Update Bills/Index.tsx
$billsTsxPath = __DIR__ . '/resources/js/Pages/Bills/Index.tsx';
$billsTsx = file_get_contents($billsTsxPath);
$billsTsx = str_replace(
    'export default function Index({ bills, filters }: any) {',
    'export default function Index({ bills, filters, classes, billTypes, academicYears }: any) {',
    $billsTsx
);

// Add bulk button and state
$billsTsx = str_replace(
    'const [search, setSearch] = useState(filters?.search || \'\');',
    "const [search, setSearch] = useState(filters?.search || '');\n    const [showBulkModal, setShowBulkModal] = useState(false);\n    const { data: bulkData, setData: setBulkData, post: bulkPost, processing: bulkProcessing, reset: resetBulk } = useForm({ bill_type_id: '', academic_year_id: '', class_id: '', period: '', amount: '', due_date: '' });",
    $billsTsx
);

// Add bulk submit handler
$billsTsx = str_replace(
    'const handleSearch = (e: any) => {',
    "const submitBulk = (e: any) => {\n        e.preventDefault();\n        bulkPost('/bills/bulk', {\n            onSuccess: () => {\n                setShowBulkModal(false);\n                resetBulk();\n            }\n        });\n    };\n\n    const handleSearch = (e: any) => {",
    $billsTsx
);

// Add the button
$billsTsx = str_replace(
    '<h1 className="text-2xl font-bold text-slate-900 mb-6">Pencarian & Pembayaran Tagihan</h1>',
    '<div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold text-slate-900">Pencarian & Pembayaran Tagihan</h1><button onClick={() => setShowBulkModal(true)} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium shadow-sm">+ Generate Tagihan Massal</button></div>',
    $billsTsx
);

// Append Bulk Modal at the end of the file before `</DashboardLayout>`
$bulkModalHtml = <<<EOT
            {showBulkModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-lg mx-4">
                        <div className="p-6">
                            <h2 className="text-lg font-bold mb-4 text-slate-900">Generate Tagihan Massal</h2>
                            <form onSubmit={submitBulk}>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Tagihan</label>
                                        <select required value={bulkData.bill_type_id} onChange={e => setBulkData('bill_type_id', e.target.value)} className="w-full rounded-md border-slate-300">
                                            <option value="">Pilih Jenis</option>
                                            {billTypes?.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Tahun Ajaran</label>
                                        <select required value={bulkData.academic_year_id} onChange={e => setBulkData('academic_year_id', e.target.value)} className="w-full rounded-md border-slate-300">
                                            <option value="">Pilih Tahun Ajaran</option>
                                            {academicYears?.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Kelas (Opsional, Kosongkan = Semua Siswa)</label>
                                    <select value={bulkData.class_id} onChange={e => setBulkData('class_id', e.target.value)} className="w-full rounded-md border-slate-300">
                                        <option value="">Semua Siswa Aktif (Satu Sekolah)</option>
                                        {classes?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Periode (Cth: Juli 2026)</label>
                                        <input required type="text" value={bulkData.period} onChange={e => setBulkData('period', e.target.value)} placeholder="Agustus 2026" className="w-full rounded-md border-slate-300" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Jatuh Tempo</label>
                                        <input required type="date" value={bulkData.due_date} onChange={e => setBulkData('due_date', e.target.value)} className="w-full rounded-md border-slate-300" />
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nominal (Rp)</label>
                                    <input required type="number" value={bulkData.amount} onChange={e => setBulkData('amount', e.target.value)} className="w-full rounded-md border-slate-300 font-bold text-lg text-blue-600" />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button type="button" onClick={() => setShowBulkModal(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-md">Batal</button>
                                    <button type="submit" disabled={bulkProcessing} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-bold shadow-sm">
                                        {bulkProcessing ? 'Memproses...' : 'Generate Tagihan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            )}
EOT;

$billsTsx = str_replace(
    '</DashboardLayout>',
    $bulkModalHtml . "\n        </DashboardLayout>",
    $billsTsx
);
file_put_contents($billsTsxPath, $billsTsx);

echo "React UI updated for Promotion and Bulk Bills.\n";
