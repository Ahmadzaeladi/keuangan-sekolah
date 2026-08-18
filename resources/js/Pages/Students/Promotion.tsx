import React, { useState, useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent } from '@/Components/UI/Card';

export default function Promotion({ classes, students }: any) {
    const [sourceClass, setSourceClass] = useState('');
    const [targetClass, setTargetClass] = useState('');
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    
    

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

    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setProcessing(true);
        import('@inertiajs/react').then(({ router }) => {
            router.post('/students/promote', {
                student_ids: selectedStudents, 
                target_class_id: targetClass 
            }, {
                onSuccess: () => {
                    setSelectedStudents([]);
                    setSourceClass('');
                    setTargetClass('');
                },
                onFinish: () => setProcessing(false)
            });
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