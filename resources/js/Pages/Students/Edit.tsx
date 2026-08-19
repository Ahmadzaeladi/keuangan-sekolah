import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ student, classes, guardians }: any) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        nis: student.nis || '',
        nisn: student.nisn || '',
        name: student.name || '',
        student_class_id: student.student_class_id || '',
        guardian_id: student.guardian_id || '',
        gender: student.gender || 'L',
        religion: student.religion || '',
        birth_place: student.birth_place || '',
        birth_date: student.birth_date ? student.birth_date.split('T')[0] : '',
        address: student.address || '',
        phone: student.phone || '',
        status: student.status || 'ACTIVE',
        photo: null as File | null,
        remove_photo: false
    });

    const [preview, setPreview] = React.useState<string | null>(student.photo ? `/storage/${student.photo}` : null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            setPreview(URL.createObjectURL(file));
            setData('remove_photo', false);
        }
    };

    const handleRemovePhoto = () => {
        setData('photo', null);
        setPreview(null);
        setData('remove_photo', true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('students.update', student.id));
    };

    return (
        <DashboardLayout>
            <Head title="Edit Siswa" />
            <div className="max-w-3xl mx-auto w-full pb-12">
                <div className="flex items-center gap-4 mb-6">
                    <Link href={route('students.index')} className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-2 rounded-full hover:bg-surface-container-low">
                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    </Link>
                    <h2 className="font-headline-lg text-on-surface">Edit Data Siswa</h2>
                </div>

                <form onSubmit={handleSubmit} className="bg-surface rounded-xl border p-6 space-y-6 shadow-sm" encType="multipart/form-data">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-outline-variant bg-surface-container-highest flex items-center justify-center text-on-surface-variant relative group">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="material-symbols-outlined text-[48px]">person</span>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <label htmlFor="photo-upload" className="cursor-pointer text-white flex flex-col items-center">
                                    <span className="material-symbols-outlined">upload</span>
                                    <span className="text-[10px]">Change</span>
                                </label>
                            </div>
                        </div>
                        {preview && (
                            <button type="button" onClick={handleRemovePhoto} className="mt-2 text-xs text-error hover:underline flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">delete</span> Hapus Foto
                            </button>
                        )}
                        <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                        {errors.photo && <p className="text-error text-xs mt-2">{errors.photo}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-label-md font-medium text-on-surface mb-2">NIS *</label>
                            <input 
                                type="text" 
                                value={data.nis} 
                                onChange={e => setData('nis', e.target.value)} 
                                className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary bg-surface-container-lowest" 
                                required 
                            />
                            {errors.nis && <p className="text-error text-xs mt-1">{errors.nis}</p>}
                        </div>
                        <div>
                            <label className="block text-label-md font-medium text-on-surface mb-2">NISN</label>
                            <input 
                                type="text" 
                                value={data.nisn} 
                                onChange={e => setData('nisn', e.target.value)} 
                                className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary bg-surface-container-lowest" 
                            />
                            {errors.nisn && <p className="text-error text-xs mt-1">{errors.nisn}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-label-md font-medium text-on-surface mb-2">Nama Lengkap *</label>
                        <input 
                            type="text" 
                            value={data.name} 
                            onChange={e => setData('name', e.target.value)} 
                            className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary bg-surface-container-lowest" 
                            required 
                        />
                        {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-label-md font-medium text-on-surface mb-2">Kelas *</label>
                            <select 
                                value={data.student_class_id} 
                                onChange={e => setData('student_class_id', e.target.value)} 
                                className="w-full px-4 py-2 border rounded-lg bg-surface-container-lowest" 
                                required
                            >
                                <option value="">Pilih Kelas</option>
                                {classes.map((c: any) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            {errors.student_class_id && <p className="text-error text-xs mt-1">{errors.student_class_id}</p>}
                        </div>
                        <div>
                            <label className="block text-label-md font-medium text-on-surface mb-2">Wali Siswa *</label>
                            <select 
                                value={data.guardian_id} 
                                onChange={e => setData('guardian_id', e.target.value)} 
                                className="w-full px-4 py-2 border rounded-lg bg-surface-container-lowest" 
                                required
                            >
                                <option value="">Pilih Wali</option>
                                {guardians.map((g: any) => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                            </select>
                            {errors.guardian_id && <p className="text-error text-xs mt-1">{errors.guardian_id}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-label-md font-medium text-on-surface mb-2">Jenis Kelamin *</label>
                            <select 
                                value={data.gender} 
                                onChange={e => setData('gender', e.target.value)} 
                                className="w-full px-4 py-2 border rounded-lg bg-surface-container-lowest" 
                                required
                            >
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                            {errors.gender && <p className="text-error text-xs mt-1">{errors.gender}</p>}
                        </div>
                        <div>
                            <label className="block text-label-md font-medium text-on-surface mb-2">Agama</label>
                            <input 
                                type="text" 
                                value={data.religion} 
                                onChange={e => setData('religion', e.target.value)} 
                                className="w-full px-4 py-2 border rounded-lg bg-surface-container-lowest" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-label-md font-medium text-on-surface mb-2">Tempat Lahir</label>
                            <input 
                                type="text" 
                                value={data.birth_place} 
                                onChange={e => setData('birth_place', e.target.value)} 
                                className="w-full px-4 py-2 border rounded-lg bg-surface-container-lowest" 
                            />
                        </div>
                        <div>
                            <label className="block text-label-md font-medium text-on-surface mb-2">Tanggal Lahir</label>
                            <input 
                                type="date" 
                                value={data.birth_date} 
                                onChange={e => setData('birth_date', e.target.value)} 
                                className="w-full px-4 py-2 border rounded-lg bg-surface-container-lowest" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-label-md font-medium text-on-surface mb-2">Alamat Lengkap</label>
                        <textarea 
                            value={data.address} 
                            onChange={e => setData('address', e.target.value)} 
                            className="w-full px-4 py-2 border rounded-lg bg-surface-container-lowest" 
                            rows={3}
                        ></textarea>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-label-md font-medium text-on-surface mb-2">No. Telepon Siswa</label>
                            <input 
                                type="text" 
                                value={data.phone} 
                                onChange={e => setData('phone', e.target.value)} 
                                className="w-full px-4 py-2 border rounded-lg bg-surface-container-lowest" 
                            />
                        </div>
                        <div>
                            <label className="block text-label-md font-medium text-on-surface mb-2">Status *</label>
                            <select 
                                value={data.status} 
                                onChange={e => setData('status', e.target.value)} 
                                className="w-full px-4 py-2 border rounded-lg bg-surface-container-lowest" 
                                required
                            >
                                <option value="ACTIVE">Aktif</option>
                                <option value="INACTIVE">Tidak Aktif</option>
                                <option value="GRADUATED">Lulus</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 border-t flex justify-end gap-4">
                        <Link href={route('students.index')} className="px-6 py-2 rounded-lg border border-outline text-on-surface hover:bg-surface-container-low transition-colors font-medium">Batal</Link>
                        <button type="submit" disabled={processing} className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">save</span> Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
