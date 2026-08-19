import React, { useState, useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent } from '@/Components/UI/Card';

export default function Promotion({ classes, students }: any) {
    const [sourceClass, setSourceClass] = useState('');
    const [targetClass, setTargetClass] = useState('');
    const [actionType, setActionType] = useState('NAIK_KELAS');
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    
    const sourceStudents = useMemo(() => {
        if (!sourceClass) return [];
        return students.filter((s: any) => s.student_class_id.toString() === sourceClass);
    }, [sourceClass, students]);

    const handleSelectAll = () => {
        setSelectedStudents(sourceStudents.map((s: any) => s.id));
    };

    const handleClearSelection = () => {
        setSelectedStudents([]);
    };

    const handleSelectStudent = (id: number) => {
        if (selectedStudents.includes(id)) {
            setSelectedStudents(selectedStudents.filter(sid => sid !== id));
        } else {
            setSelectedStudents([...selectedStudents, id]);
        }
    };

    const [processing, setProcessing] = useState(false);
    const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setProcessing(true);
        const submitTarget = actionType === 'LULUS' ? 'LULUS' : targetClass;
        
        import('@inertiajs/react').then(({ router }) => {
            router.post('/students/promote', {
                student_ids: selectedStudents, 
                target_class_id: submitTarget 
            }, {
                onSuccess: () => {
                    setSelectedStudents([]);
                    setSourceClass('');
                    setTargetClass('');
                    setToast({ message: 'Berhasil! Data siswa telah diperbarui.', type: 'success' });
                    setTimeout(() => setToast(null), 4000);
                },
                onError: () => {
                    setToast({ message: 'Gagal! Terjadi kesalahan saat memproses data.', type: 'error' });
                    setTimeout(() => setToast(null), 4000);
                },
                onFinish: () => setProcessing(false)
            });
        });
    };

    let actionText = "Pindahkan";
    if (actionType === 'NAIK_KELAS') actionText = "Naikkan";
    if (actionType === 'TURUN_KELAS') actionText = "Turunkan";
    if (actionType === 'LULUS') actionText = "Luluskan";

    return (
        <DashboardLayout>
            <Head title="Kenaikan Kelas" />
            <div className="max-w-container-max mx-auto w-full pb-12">
                <div className="mb-8 mt-4">
                    <h1 className="font-headline-lg text-on-surface">Kenaikan Kelas / Mutasi</h1>
                    <p className="font-body-md text-on-surface-variant mt-2">Atur kenaikan kelas, tinggal kelas, atau kelulusan siswa secara massal.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-outline-variant bg-surface-container-lowest">
                                <h2 className="font-headline-sm text-on-surface mb-4">1. Pilih Kelas Asal</h2>
                                <select 
                                    value={sourceClass} 
                                    onChange={e => { setSourceClass(e.target.value); setSelectedStudents([]); }} 
                                    className="w-full rounded-lg border border-outline focus:border-primary focus:ring-primary bg-surface px-4 py-2"
                                >
                                    <option value="">-- Pilih Kelas --</option>
                                    {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            
                            <div className="p-4 border-b border-outline-variant flex gap-2 bg-surface-container-low justify-between items-center">
                                <span className="font-label-md text-on-surface-variant">Data Siswa:</span>
                                <div className="flex gap-2">
                                    <button type="button" onClick={handleSelectAll} disabled={!sourceClass} className="px-3 py-1.5 rounded-lg bg-surface border border-outline text-on-surface text-sm font-medium hover:bg-surface-container disabled:opacity-50 transition-colors">
                                        Pilih Semua
                                    </button>
                                    <button type="button" onClick={handleClearSelection} disabled={!sourceClass} className="px-3 py-1.5 rounded-lg bg-surface border border-outline text-error text-sm font-medium hover:bg-error-container/20 disabled:opacity-50 transition-colors">
                                        Kosongkan
                                    </button>
                                </div>
                            </div>
                            
                            <div className="h-[450px] overflow-y-auto bg-surface relative">
                                {sourceClass ? (
                                    <table className="w-full text-left">
                                        <thead className="bg-surface-container-low sticky top-0 border-b border-outline-variant shadow-sm">
                                            <tr>
                                                <th className="px-6 py-4 w-12">
                                                    <input 
                                                        type="checkbox" 
                                                        onChange={(e) => e.target.checked ? handleSelectAll() : handleClearSelection()} 
                                                        checked={selectedStudents.length === sourceStudents.length && sourceStudents.length > 0} 
                                                        className="rounded border-outline text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                                                    />
                                                </th>
                                                <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">NIS</th>
                                                <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">Nama Siswa</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-outline-variant">
                                            {sourceStudents.map((s: any) => (
                                                <tr key={s.id} className="hover:bg-surface-container-lowest transition-colors cursor-pointer" onClick={() => handleSelectStudent(s.id)}>
                                                    <td className="px-6 py-4">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={selectedStudents.includes(s.id)} 
                                                            onChange={() => handleSelectStudent(s.id)} 
                                                            onClick={e => e.stopPropagation()}
                                                            className="rounded border-outline text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-mono text-on-surface-variant">{s.nis}</td>
                                                    <td className="px-6 py-4 font-medium text-on-surface">{s.name}</td>
                                                </tr>
                                            ))}
                                            {sourceStudents.length === 0 && (
                                                <tr><td colSpan={3} className="px-6 py-12 text-center text-on-surface-variant">Tidak ada siswa di kelas ini.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-on-surface-variant italic">
                                        Silakan pilih kelas asal terlebih dahulu.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col h-fit">
                            <div className="p-6 border-b border-outline-variant bg-surface-container-lowest">
                                <h2 className="font-headline-sm text-on-surface mb-4">2. Pilih Aksi & Tujuan</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-on-surface-variant mb-1">Aksi</label>
                                        <select 
                                            value={actionType} 
                                            onChange={e => setActionType(e.target.value)} 
                                            className="w-full rounded-lg border border-outline focus:border-primary focus:ring-primary bg-surface px-4 py-2"
                                        >
                                            <option value="NAIK_KELAS">Naik Kelas / Mutasi</option>
                                            <option value="TURUN_KELAS">Tinggal / Turun Kelas</option>
                                            <option value="LULUS">Lulus / Alumni</option>
                                        </select>
                                    </div>
                                    
                                    {actionType !== 'LULUS' && (
                                        <div>
                                            <label className="block text-sm font-medium text-on-surface-variant mb-1">Kelas Tujuan</label>
                                            <select 
                                                value={targetClass} 
                                                onChange={e => setTargetClass(e.target.value)} 
                                                required 
                                                className="w-full rounded-lg border border-outline focus:border-primary focus:ring-primary bg-surface px-4 py-2"
                                            >
                                                <option value="">-- Pilih Kelas Tujuan --</option>
                                                {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="p-8 flex flex-col items-stretch">
                                <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 mb-6 flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[32px]">groups</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Siswa Terpilih</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-black text-on-surface">{selectedStudents.length}</span>
                                            <span className="text-lg font-medium text-on-surface-variant">Orang</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl mb-8 flex gap-3 text-on-surface-variant">
                                    <span className="material-symbols-outlined text-primary shrink-0">info</span>
                                    <p className="text-sm leading-relaxed">
                                        Tinjau kembali pilihan Anda. Aksi ini akan mengubah status kelas siswa secara permanen atau meluluskan mereka dari sistem.
                                    </p>
                                </div>
                                
                                <button 
                                    type="submit" 
                                    disabled={processing || selectedStudents.length === 0 || (actionType !== 'LULUS' && !targetClass)} 
                                    className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg flex justify-center items-center gap-2"
                                >
                                    {processing ? 'Memproses...' : `${actionText} ${selectedStudents.length} Siswa Sekarang`}
                                    {!processing && <span className="material-symbols-outlined">east</span>}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            
            {/* Toast Notification Top Right */}
            {toast && (
                <div className={`fixed top-6 right-6 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-top-5 z-[100] font-medium ${
                    toast.type === 'success' ? 'bg-[#064e3b] text-white' : 'bg-red-600 text-white'
                }`}>
                    <span className="material-symbols-outlined">
                        {toast.type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    {toast.message}
                </div>
            )}
        </DashboardLayout>
    );
}