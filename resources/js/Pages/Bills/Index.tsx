import React, { useState } from 'react';
import DashboardLayout, { cn } from '@/Layouts/DashboardLayout';
import { Head, router } from '@inertiajs/react';
import { toast } from 'sonner';

export default function Automation({ classes = [], billTypes = [], academicYears = [] }: any) {
    const [status, setStatus] = useState('Generate All Bills');
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Form state
    const [form, setForm] = useState({
        bill_type_id: billTypes.length > 0 ? billTypes[0].id : '',
        academic_year_id: academicYears.length > 0 ? academicYears[0].id : '',
        class_id: '',
        generate_mode: 'single', // single, semester1, semester2, year
        period: 'Juli',
        amount: 450000,
        due_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 10).toISOString().split('T')[0]
    });

    const handleGenerate = () => {
        setIsProcessing(true);
        setStatus('Memproses...');
        router.post('/bills/bulk', form, {
            preserveScroll: true,
            onSuccess: (page: any) => {
                setStatus('Generate All Bills');
                setIsProcessing(false);
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0] as string;
                toast.error(firstError || 'Pastikan semua kolom terisi dengan benar.');
                setStatus('Generate All Bills');
                setIsProcessing(false);
            }
        });
    }

    return (
        <DashboardLayout>
            <Head title="Otomasi Tagihan" />

            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="font-display-lg text-primary">Otomasi Tagihan</h2>
                        <p className="text-on-surface-variant">Buat tagihan secara massal untuk siswa.</p>
                    </div>
                </div>

                <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm p-8">
                    <h3 className="font-headline-md mb-6 text-on-surface">Parameter Tagihan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Jenis Tagihan *</label>
                            <select 
                                value={form.bill_type_id}
                                onChange={e => setForm({...form, bill_type_id: e.target.value})}
                                className="w-full pl-4 pr-10 py-3 border border-outline-variant rounded-xl appearance-none focus:border-primary outline-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231b1c19%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:12px_12px] bg-[right_16px_center]">
                                {billTypes.map((type: any) => <option key={type.id} value={type.id}>{type.name}</option>)}
                                {billTypes.length === 0 && <option value="">Tidak ada data</option>}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Tahun Ajaran *</label>
                            <select 
                                value={form.academic_year_id}
                                onChange={e => setForm({...form, academic_year_id: e.target.value})}
                                className="w-full pl-4 pr-10 py-3 border border-outline-variant rounded-xl appearance-none focus:border-primary outline-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231b1c19%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:12px_12px] bg-[right_16px_center]">
                                {academicYears.map((ay: any) => <option key={ay.id} value={ay.id}>{ay.name}</option>)}
                                {academicYears.length === 0 && <option value="">Tidak ada data</option>}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Kelas (Opsional)</label>
                            <select 
                                value={form.class_id}
                                onChange={e => setForm({...form, class_id: e.target.value})}
                                className="w-full pl-4 pr-10 py-3 border border-outline-variant rounded-xl appearance-none focus:border-primary outline-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231b1c19%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:12px_12px] bg-[right_16px_center]">
                                <option value="">Semua Kelas</option>
                                {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Mode Generate *</label>
                            <select 
                                value={form.generate_mode}
                                onChange={e => setForm({...form, generate_mode: e.target.value})}
                                className="w-full pl-4 pr-10 py-3 border border-outline-variant rounded-xl appearance-none focus:border-primary outline-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231b1c19%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:12px_12px] bg-[right_16px_center]"
                            >
                                <option value="single">1 Bulan Saja</option>
                                <option value="semester1">1 Semester (Ganjil: Jul - Des)</option>
                                <option value="semester2">1 Semester (Genap: Jan - Jun)</option>
                                <option value="year">1 Tahun (Jul - Jun)</option>
                            </select>
                        </div>

                        {form.generate_mode === 'single' && (
                            <div>
                                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Periode / Bulan *</label>
                                <input 
                                    type="text" 
                                    value={form.period}
                                    onChange={e => setForm({...form, period: e.target.value})}
                                    placeholder="Misal: Juli"
                                    className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary outline-none" 
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Nominal (Rp) *</label>
                            <input 
                                type="number" 
                                value={form.amount}
                                onChange={e => setForm({...form, amount: parseInt(e.target.value) || 0})}
                                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary outline-none font-mono" 
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                                {form.generate_mode === 'single' ? 'Batas Waktu Pembayaran (Due Date) *' : 'Jatuh Tempo Bulan Pertama *'}
                            </label>
                            <input 
                                type="date" 
                                value={form.due_date}
                                onChange={e => setForm({...form, due_date: e.target.value})}
                                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary outline-none" 
                            />
                            {form.generate_mode !== 'single' && (
                                <p className="text-[10px] text-on-surface-variant mt-1">Bulan berikutnya akan otomatis ditambah 1 bulan dari tanggal ini.</p>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="bg-surface-container-low p-6 rounded-2xl text-center border border-outline-variant flex flex-col md:flex-row items-center justify-between shadow-sm">
                    <p className="text-on-surface-variant text-sm text-left mb-4 md:mb-0 md:mr-6 flex-1">Proses ini akan menghasilkan tagihan finansial permanen untuk semua siswa yang masuk dalam kriteria di atas. Pastikan data sudah benar sebelum menekan tombol.</p>
                    <button 
                        onClick={handleGenerate} 
                        disabled={isProcessing}
                        className={cn(
                            "py-3 px-8 rounded-xl font-bold transition-all shrink-0 min-w-[200px]",
                            isProcessing ? "bg-outline text-surface cursor-not-allowed" : "bg-primary text-on-primary hover:bg-primary-container hover:shadow-md hover:-translate-y-0.5"
                        )}>
                        {status}
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}