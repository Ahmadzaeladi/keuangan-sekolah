import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card } from '@/Components/UI/Card';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';

export default function Types({ billTypes }: { billTypes: any[] }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<any>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        default_amount: 0 as number | string,
    });

    const openCreateModal = () => {
        reset();
        clearErrors();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (type: any) => {
        reset();
        clearErrors();
        setSelectedType(type);
        setData({
            name: type.name,
            default_amount: type.default_amount || 0
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (type: any) => {
        setSelectedType(type);
        setIsDeleteModalOpen(true);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('bill-types.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            }
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('bill-types.update', selectedType.id), {
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
            }
        });
    };

    const handleDelete = () => {
        destroy(route('bill-types.destroy', selectedType.id), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
            }
        });
    };

    return (
        <DashboardLayout>
            <Head title="Jenis Tagihan" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-headline-md font-bold text-primary">Jenis Tagihan</h2>
                    <p className="text-on-surface-variant mt-1">Kelola daftar jenis tagihan yang tersedia (SPP, Gedung, Study Tour, dll).</p>
                </div>
                <PrimaryButton onClick={openCreateModal} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span>Tambah Jenis Tagihan</span>
                </PrimaryButton>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-outline-variant bg-surface-container-lowest">
                                <th className="p-4 font-semibold text-primary">Nama Tagihan</th>
                                <th className="p-4 font-semibold text-primary">Nominal Default (Rp)</th>
                                <th className="p-4 font-semibold text-primary w-32">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billTypes.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="p-8 text-center text-on-surface-variant">
                                        Belum ada data jenis tagihan.
                                    </td>
                                </tr>
                            ) : (
                                billTypes.map((type) => (
                                    <tr key={type.id} className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                                        <td className="p-4 font-medium">{type.name}</td>
                                        <td className="p-4 font-medium text-on-surface-variant">
                                            {Number(type.default_amount || 0).toLocaleString('id-ID')}
                                        </td>
                                        <td className="p-4 flex gap-2">
                                            <button 
                                                onClick={() => openEditModal(type)}
                                                className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center hover:opacity-80 transition-opacity"
                                                title="Edit"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                            <button 
                                                onClick={() => openDeleteModal(type)}
                                                className="w-8 h-8 rounded-full bg-error-container text-on-error-container flex items-center justify-center hover:opacity-80 transition-opacity"
                                                title="Hapus"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Create Modal */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                <div className="p-6">
                    <h3 className="text-title-lg font-bold text-primary mb-4">Tambah Jenis Tagihan</h3>
                    <form onSubmit={handleCreate}>
                        <div className="mb-4">
                            <InputLabel htmlFor="name" value="Nama Tagihan" />
                            <TextInput
                                id="name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div className="mb-4">
                            <InputLabel htmlFor="default_amount" value="Nominal Default (Rp)" />
                            <TextInput
                                id="default_amount"
                                type="number"
                                className="mt-1 block w-full font-mono"
                                value={data.default_amount}
                                onChange={e => setData('default_amount', e.target.value === '' ? '' : Number(e.target.value))}
                                required
                            />
                            <InputError message={errors.default_amount as string} className="mt-2" />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-full font-medium transition-colors"
                                onClick={() => setIsCreateModalOpen(false)}
                            >
                                Batal
                            </button>
                            <PrimaryButton type="submit" disabled={processing}>
                                Simpan
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <div className="p-6">
                    <h3 className="text-title-lg font-bold text-primary mb-4">Edit Jenis Tagihan</h3>
                    <form onSubmit={handleEdit}>
                        <div className="mb-4">
                            <InputLabel htmlFor="edit_name" value="Nama Tagihan" />
                            <TextInput
                                id="edit_name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div className="mb-4">
                            <InputLabel htmlFor="edit_default_amount" value="Nominal Default (Rp)" />
                            <TextInput
                                id="edit_default_amount"
                                type="number"
                                className="mt-1 block w-full font-mono"
                                value={data.default_amount}
                                onChange={e => setData('default_amount', e.target.value === '' ? '' : Number(e.target.value))}
                                required
                            />
                            <InputError message={errors.default_amount as string} className="mt-2" />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-full font-medium transition-colors"
                                onClick={() => setIsEditModalOpen(false)}
                            >
                                Batal
                            </button>
                            <PrimaryButton type="submit" disabled={processing}>
                                Simpan Perubahan
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <div className="p-6">
                    <h3 className="text-title-lg font-bold text-error mb-4">Hapus Jenis Tagihan</h3>
                    <p className="text-on-surface-variant mb-6">
                        Apakah Anda yakin ingin menghapus jenis tagihan <b>{selectedType?.name}</b>?
                        Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-full font-medium transition-colors"
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-error text-on-error hover:opacity-90 rounded-full font-medium transition-opacity"
                            onClick={handleDelete}
                            disabled={processing}
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
