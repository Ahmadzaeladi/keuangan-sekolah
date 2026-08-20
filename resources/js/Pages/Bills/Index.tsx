import React, { useState } from 'react';
import DashboardLayout, { cn } from '@/Layouts/DashboardLayout';
import { Head, router, Link } from '@inertiajs/react';
import { toast } from 'sonner';
import Modal from '@/Components/Modal';

export default function Automation({ classes = [], billTypes = [], academicYears = [], allStudents = [], bills, filters = {} }: any) {
    const [status, setStatus] = useState('Buat Tagihan Sesuai Pilihan');
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Bulk delete state
    const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
    const [bulkDeleteForm, setBulkDeleteForm] = useState({
        bill_type_id: billTypes.length > 0 ? billTypes[0].id : '',
        academic_year_id: academicYears.length > 0 ? academicYears[0].id : '',
        class_id: ''
    });
    
    // Form state
    const [form, setForm] = useState({
        bill_type_id: billTypes.length > 0 ? billTypes[0].id : '',
        academic_year_id: academicYears.length > 0 ? academicYears[0].id : '',
        class_id: '',
        student_id: '',
        generate_mode: 'single', // single, semester1, semester2, year
        period: 'Juli',
        amount: (billTypes.length > 0 ? (billTypes[0].default_amount || 0) : 0) as number | string,
        due_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 10).toISOString().split('T')[0]
    });
    
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/bills', { search }, { preserveState: true });
    }

    const handleGenerate = () => {
        setIsProcessing(true);
        setStatus('Memproses...');
        router.post('/bills/bulk', form, {
            preserveScroll: true,
            onSuccess: (page: any) => {
                setStatus('Buat Tagihan Sesuai Pilihan');
                setIsProcessing(false);
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0] as string;
                toast.error(firstError || 'Pastikan semua kolom terisi dengan benar.');
                setStatus('Buat Tagihan Sesuai Pilihan');
                setIsProcessing(false);
            }
        });
    }
    
    const handleBulkDelete = (e: React.FormEvent) => {
        e.preventDefault();
        if (confirm('Apakah Anda yakin ingin menghapus SEMUA tagihan BELUM LUNAS untuk kriteria ini? Tindakan ini tidak dapat dibatalkan.')) {
            setIsProcessing(true);
            router.delete('/bills/bulk', {
                data: bulkDeleteForm,
                preserveScroll: true,
                onSuccess: () => {
                    setIsBulkDeleteModalOpen(false);
                    setIsProcessing(false);
                },
                onError: () => setIsProcessing(false)
            });
        }
    }

    const handleDeleteBill = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus tagihan ini? Tindakan ini tidak dapat dibatalkan.')) {
            router.delete(`/bills/${id}`, {
                preserveScroll: true
            });
        }
    }

    return (
        <DashboardLayout>
            <Head title="Pembuatan Tagihan" />

            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="font-display-lg text-primary">Buat Tagihan</h2>
                        <p className="text-on-surface-variant">Buat tagihan baru untuk semua siswa, per kelas, atau siswa spesifik secara cepat.</p>
                    </div>
                </div>

                <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm p-8">
                    <h3 className="font-headline-md mb-6 text-on-surface">Parameter Tagihan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Jenis Tagihan *</label>
                            <select 
                                value={form.bill_type_id}
                                onChange={e => {
                                    const selectedType = billTypes.find((t: any) => t.id == e.target.value);
                                    setForm({...form, bill_type_id: e.target.value, amount: selectedType ? selectedType.default_amount : 0});
                                }}
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
                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Siswa Spesifik (Opsional)</label>
                            <select 
                                value={form.student_id}
                                onChange={e => {
                                    setForm({...form, student_id: e.target.value});
                                    if(e.target.value) setForm(f => ({...f, class_id: ''})); // Reset class if student is selected
                                }}
                                className="w-full pl-4 pr-10 py-3 border border-outline-variant rounded-xl appearance-none focus:border-primary outline-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231b1c19%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:12px_12px] bg-[right_16px_center]">
                                <option value="">Semua Siswa / Berdasarkan Kelas</option>
                                {allStudents?.map((s: any) => <option key={s.id} value={s.id}>{s.name} ({s.nis})</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Kelas (Opsional)</label>
                            <select 
                                value={form.class_id}
                                disabled={!!form.student_id}
                                onChange={e => setForm({...form, class_id: e.target.value})}
                                className="w-full pl-4 pr-10 py-3 border border-outline-variant rounded-xl appearance-none focus:border-primary outline-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231b1c19%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:12px_12px] bg-[right_16px_center] disabled:opacity-50 disabled:bg-gray-100">
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
                                onChange={e => setForm({...form, amount: e.target.value === '' ? '' : Number(e.target.value)})}
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
                    <p className="text-on-surface-variant text-sm text-left mb-4 md:mb-0 md:mr-6 flex-1">
                        Sistem hanya akan membuat tagihan <b>{billTypes.find((t:any) => t.id == form.bill_type_id)?.name || 'pilihan Anda'}</b> untuk target siswa yang dipilih. Tagihan lain (seperti SPP atau Seragam) tidak ikut dibuat kecuali Anda memilihnya. Pastikan data sudah benar sebelum memproses.
                    </p>
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

            <div className="max-w-7xl mx-auto mt-12 space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="font-display-md text-primary">Daftar Tagihan Tersimpan</h2>
                        <p className="text-on-surface-variant text-sm mt-1">Daftar semua tagihan yang sudah digenerate ke siswa.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Cari NIS / Nama..." 
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="px-4 py-2 border border-outline-variant rounded-full text-sm outline-none focus:border-primary w-full sm:w-64"
                            />
                            <button type="submit" className="px-4 py-2 bg-primary text-on-primary rounded-full text-sm font-semibold hover:bg-primary-container hover:text-on-primary-container transition-colors">
                                Cari
                            </button>
                        </form>
                        <button 
                            onClick={() => setIsBulkDeleteModalOpen(true)}
                            className="px-4 py-2 border border-error text-error rounded-full text-sm font-semibold hover:bg-error-container transition-colors"
                        >
                            Hapus Massal
                        </button>
                    </div>
                </div>

                <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-outline-variant bg-surface-container-lowest">
                                    <th className="p-4 font-semibold text-primary">Siswa</th>
                                    <th className="p-4 font-semibold text-primary">Kelas</th>
                                    <th className="p-4 font-semibold text-primary">Jenis Tagihan</th>
                                    <th className="p-4 font-semibold text-primary">Periode</th>
                                    <th className="p-4 font-semibold text-primary text-right">Nominal (Rp)</th>
                                    <th className="p-4 font-semibold text-primary text-center">Status</th>
                                    <th className="p-4 font-semibold text-primary w-24 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bills?.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-on-surface-variant">Belum ada data tagihan.</td>
                                    </tr>
                                ) : (
                                    bills?.data?.map((bill: any) => (
                                        <tr key={bill.id} className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                                            <td className="p-4">
                                                <div className="font-medium text-on-surface">{bill.student?.name}</div>
                                                <div className="text-xs text-on-surface-variant">{bill.student?.nis}</div>
                                            </td>
                                            <td className="p-4 text-on-surface-variant">{bill.student?.student_class?.name || '-'}</td>
                                            <td className="p-4 font-medium">{bill.bill_type?.name}</td>
                                            <td className="p-4 text-on-surface-variant">{bill.period}</td>
                                            <td className="p-4 font-medium text-right">{Number(bill.amount).toLocaleString('id-ID')}</td>
                                            <td className="p-4 text-center">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-xs font-semibold",
                                                    bill.status === 'PAID' ? "bg-primary-container text-on-primary-container" : "bg-error-container text-on-error-container"
                                                )}>
                                                    {bill.status === 'PAID' ? 'LUNAS' : 'BELUM LUNAS'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                {bill.status !== 'PAID' && (
                                                    <button 
                                                        onClick={() => handleDeleteBill(bill.id)}
                                                        className="w-8 h-8 mx-auto rounded-full bg-error-container text-on-error-container flex items-center justify-center hover:opacity-80 transition-opacity"
                                                        title="Hapus Tagihan"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {bills?.links && bills.data.length > 0 && (
                    <div className="flex justify-center mt-6 gap-2">
                        {bills.links.map((link: any, i: number) => (
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

            <Modal show={isBulkDeleteModalOpen} onClose={() => setIsBulkDeleteModalOpen(false)}>
                <div className="p-6">
                    <h3 className="text-title-lg font-bold text-error mb-4">Hapus Tagihan Massal (Rollback)</h3>
                    <p className="text-on-surface-variant mb-6 text-sm">
                        Gunakan fitur ini jika Anda salah saat melakukan generate tagihan. Sistem <b>hanya</b> akan menghapus tagihan yang masih menunggak (Belum Lunas).
                    </p>
                    <form onSubmit={handleBulkDelete}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Jenis Tagihan *</label>
                                <select 
                                    value={bulkDeleteForm.bill_type_id}
                                    onChange={e => setBulkDeleteForm({...bulkDeleteForm, bill_type_id: e.target.value})}
                                    className="w-full pl-4 pr-10 py-3 border border-outline-variant rounded-xl appearance-none focus:border-primary outline-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231b1c19%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:12px_12px] bg-[right_16px_center]">
                                    {billTypes.map((type: any) => <option key={type.id} value={type.id}>{type.name}</option>)}
                                    {billTypes.length === 0 && <option value="">Tidak ada data</option>}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Tahun Ajaran *</label>
                                <select 
                                    value={bulkDeleteForm.academic_year_id}
                                    onChange={e => setBulkDeleteForm({...bulkDeleteForm, academic_year_id: e.target.value})}
                                    className="w-full pl-4 pr-10 py-3 border border-outline-variant rounded-xl appearance-none focus:border-primary outline-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231b1c19%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:12px_12px] bg-[right_16px_center]">
                                    {academicYears.map((ay: any) => <option key={ay.id} value={ay.id}>{ay.name}</option>)}
                                    {academicYears.length === 0 && <option value="">Tidak ada data</option>}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Kelas (Opsional)</label>
                                <select 
                                    value={bulkDeleteForm.class_id}
                                    onChange={e => setBulkDeleteForm({...bulkDeleteForm, class_id: e.target.value})}
                                    className="w-full pl-4 pr-10 py-3 border border-outline-variant rounded-xl appearance-none focus:border-primary outline-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231b1c19%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:12px_12px] bg-[right_16px_center]">
                                    <option value="">Semua Kelas</option>
                                    {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                type="button"
                                className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-full font-medium transition-colors"
                                onClick={() => setIsBulkDeleteModalOpen(false)}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className={cn(
                                    "px-4 py-2 bg-error text-on-error rounded-full font-medium transition-opacity",
                                    isProcessing ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
                                )}
                            >
                                {isProcessing ? 'Menghapus...' : 'Hapus Sekarang'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </DashboardLayout>
    );
}