import React, { useState, useMemo } from "react";
import DashboardLayout, { cn } from "@/Layouts/DashboardLayout";
import { Head, router } from "@inertiajs/react";
import axios from "axios";

export default function Payments() {
    const [searchNis, setSearchNis] = useState("");
    const [student, setStudent] = useState<any>(null);
    const [unpaidBills, setUnpaidBills] = useState<any[]>([]);

    // Form state
    const [selectedBillIds, setSelectedBillIds] = useState<number[]>([]);
    const [paymentMethod, setPaymentMethod] = useState("CASH");

    // UI state
    const [isSearching, setIsSearching] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [notification, setNotification] = useState<{
        show: boolean;
        type: "success" | "error";
        title: string;
        message: string;
    }>({ show: false, type: "success", title: "", message: "" });

    // Receipt state
    const [showReceipt, setShowReceipt] = useState(false);
    const [lastTransaction, setLastTransaction] = useState<any>(null);

    const showNotification = (
        type: "success" | "error",
        title: string,
        message: string,
    ) => {
        setNotification({ show: true, type, title, message });
        setTimeout(
            () => setNotification((prev) => ({ ...prev, show: false })),
            4000,
        );
    };

    const handleSearch = async () => {
        if (!searchNis.trim()) return;

        setIsSearching(true);
        setStudent(null);
        setUnpaidBills([]);
        setSelectedBillIds([]);
        setNotification((prev) => ({ ...prev, show: false }));

        try {
            const res = await axios.get(
                `/api/students/search?nis=${searchNis}`,
            );
            setStudent(res.data.student);
            setUnpaidBills(res.data.unpaid_bills);
            if (res.data.unpaid_bills.length === 0) {
                showNotification(
                    "success",
                    "Tidak Ada Tagihan",
                    "Siswa ini tidak memiliki tagihan yang belum dibayar.",
                );
            }
        } catch (error: any) {
            showNotification(
                "error",
                "Tidak Ditemukan",
                error.response?.data?.error || "Siswa tidak ditemukan.",
            );
        } finally {
            setIsSearching(false);
        }
    };

    const toggleBill = (billId: number) => {
        setSelectedBillIds((prev) =>
            prev.includes(billId)
                ? prev.filter((id) => id !== billId)
                : [...prev, billId],
        );
    };

    const selectAllBills = () => {
        setSelectedBillIds(unpaidBills.map((b) => b.id));
    };

    const selectSppMonths = (count: number) => {
        const sppBills = unpaidBills
            .filter((b) => b.bill_type?.name?.toUpperCase() === "SPP")
            .slice(0, count);

        const sppIds = sppBills.map((b) => b.id);

        // Keep non-SPP bills that are currently selected, add the new SPP ones
        setSelectedBillIds((prev) => {
            const nonSppSelected = prev.filter((id) => {
                const bill = unpaidBills.find((b) => b.id === id);
                return bill && bill.bill_type?.name?.toUpperCase() !== "SPP";
            });
            return [...nonSppSelected, ...sppIds];
        });
    };

    const totalAmount = useMemo(() => {
        return unpaidBills
            .filter((b) => selectedBillIds.includes(b.id))
            .reduce((sum, b) => sum + Number(b.amount || 0), 0);
    }, [unpaidBills, selectedBillIds]);

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (totalAmount === 0 || selectedBillIds.length === 0) return;

        setIsProcessing(true);

        // We simulate a loop for multiple bills, but hit the real backend
        let successCount = 0;
        let processedAmount = 0;

        const processBills = async () => {
            for (const billId of selectedBillIds) {
                const bill = unpaidBills.find((b) => b.id === billId);
                try {
                    await axios.post("/payments", {
                        bill_id: billId,
                        amount: bill?.amount,
                        payment_method: paymentMethod,
                        notes: "Pembayaran Kasir",
                    });
                    successCount++;
                    processedAmount += Number(bill?.amount || 0);
                } catch (error) {
                    console.error("Gagal membayar tagihan", billId);
                }
            }

            setIsProcessing(false);

            if (successCount > 0) {
                const trxId = `PAY-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}-${Math.floor(Math.random() * 90000) + 10000}`;

                // Get names of paid bills for receipt
                const paidBillNames = unpaidBills
                    .filter((b) => selectedBillIds.includes(b.id))
                    .map(
                        (b) =>
                            b.bill_type.name +
                            (b.period ? ` (${b.period})` : ""),
                    )
                    .join(", ");

                setLastTransaction({
                    id: trxId,
                    date: new Date().toLocaleString("id-ID", {
                        dateStyle: "long",
                        timeStyle: "short",
                    }),
                    student: student.name,
                    nis: student.nis,
                    class: student.student_class?.name || "-",
                    type: "Pembayaran Tagihan",
                    months: paidBillNames,
                    amount: processedAmount,
                });

                showNotification(
                    "success",
                    "Pembayaran Berhasil!",
                    `Tanda terima untuk Rp ${processedAmount.toLocaleString("id-ID")} siap dicetak.`,
                );
                setShowReceipt(true);

                // Refresh list
                handleSearch();
            } else {
                showNotification(
                    "error",
                    "Gagal",
                    "Terjadi kesalahan saat memproses pembayaran.",
                );
            }
        };

        processBills();
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <DashboardLayout>
            <Head title="Kasir SPP" />

            {/* Modern Toast Notification */}
            {notification.show && (
                <div className="fixed top-6 right-6 z-50 animate-bounce print:hidden">
                    <div className="bg-surface shadow-lg rounded-xl p-4 border border-outline-variant flex items-center gap-4 min-w-[300px]">
                        <div
                            className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                notification.type === "success"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-red-100 text-red-600",
                            )}
                        >
                            <span className="material-symbols-outlined">
                                {notification.type === "success"
                                    ? "check"
                                    : "error"}
                            </span>
                        </div>
                        <div>
                            <h4 className="font-bold text-on-surface text-sm">
                                {notification.title}
                            </h4>
                            <p className="text-xs text-on-surface-variant mt-0.5">
                                {notification.message}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Official Receipt Modal */}
            {showReceipt && lastTransaction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:p-0 print:bg-white print:static print:z-auto">
                    <div className="bg-white text-black w-full max-w-md rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:max-w-full">
                        {/* Receipt Header */}
                        <div className="p-6 border-b-2 border-dashed border-gray-300 relative text-center">
                            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none flex items-center justify-center">
                                <span className="material-symbols-outlined text-[150px]">
                                    verified
                                </span>
                            </div>
                            <div className="w-12 h-12 bg-primary text-white rounded-xl mx-auto flex items-center justify-center mb-3">
                                <span
                                    className="material-symbols-outlined"
                                    style={{
                                        fontVariationSettings: "'FILL' 1",
                                    }}
                                >
                                    mosque
                                </span>
                            </div>
                            <h2 className="font-bold text-lg leading-tight uppercase">
                                PONPEPS DARUL KURNIA
                            </h2>
                            <p className="text-xs text-gray-500 mb-4">
                                Jl. Bunga Mekar
                            </p>

                            <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                                Bukti Pembayaran Sah
                            </div>
                            <p className="text-sm font-mono text-gray-600">
                                {lastTransaction.id}
                            </p>
                        </div>

                        {/* Receipt Body */}
                        <div className="p-6 space-y-4 text-sm relative">
                            {/* Watermark */}
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03]">
                                <span className="text-6xl font-black rotate-[-30deg] uppercase tracking-widest text-black">
                                    PAID
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Tanggal</span>
                                <span className="font-semibold text-right">
                                    {lastTransaction.date}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Nama Siswa
                                </span>
                                <span className="font-semibold text-right">
                                    {lastTransaction.student}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    NIS / Kelas
                                </span>
                                <span className="font-semibold text-right">
                                    {lastTransaction.nis} /{" "}
                                    {lastTransaction.class}
                                </span>
                            </div>

                            <hr className="border-gray-200" />

                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="font-semibold">
                                        {lastTransaction.type}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mb-2">
                                    {lastTransaction.months}
                                </p>
                            </div>

                            <hr className="border-gray-200" />

                            <div className="flex justify-between items-center text-lg">
                                <span className="font-bold">Total Lunas</span>
                                <span className="font-black text-green-600">
                                    Rp{" "}
                                    {lastTransaction.amount.toLocaleString(
                                        "id-ID",
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Anti-fraud Footer */}
                        <div className="bg-gray-50 p-6 flex items-center justify-between border-t border-gray-200">
                            <div className="pr-4">
                                <p className="text-[10px] text-gray-500 font-medium leading-tight mb-1">
                                    Dokumen ini diamankan dengan Tanda Tangan
                                    Digital. Pindai QR Code untuk memverifikasi
                                    keaslian bukti pembayaran pada sistem resmi
                                    sekolah.
                                </p>
                            </div>
                            <div className="shrink-0 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://sikola.com/verify/${lastTransaction.id}&margin=0`}
                                    alt="Verification QR"
                                    className="w-16 h-16"
                                />
                            </div>
                        </div>

                        {/* Actions (Hidden on Print) */}
                        <div className="p-4 bg-white border-t border-gray-100 flex gap-3 print:hidden">
                            <button
                                onClick={() => setShowReceipt(false)}
                                className="flex-1 py-2.5 px-4 rounded-xl text-gray-600 font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={handlePrint}
                                className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 flex items-center justify-center transition-colors"
                            >
                                <span className="material-symbols-outlined mr-2 text-[18px]">
                                    print
                                </span>
                                Cetak Struk
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto w-full space-y-6 print:hidden">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="font-headline-lg text-on-surface">
                        Kasir Pembayaran
                    </h2>
                    {lastTransaction && (
                        <button
                            onClick={() => setShowReceipt(true)}
                            className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-lg font-medium text-sm flex items-center hover:bg-secondary/20 transition-colors"
                        >
                            <span className="material-symbols-outlined mr-2 text-[18px]">
                                receipt_long
                            </span>
                            Lihat Struk Terakhir
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column - Search & Student Info */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm">
                            <h3 className="font-headline-md mb-4 text-on-surface">
                                Cari Siswa
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                                        Nomor Induk (NIS)
                                    </label>
                                    <div className="relative">
                                        <input
                                            className="w-full pl-10 pr-4 py-3 border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                            placeholder="Contoh: 1012301"
                                            value={searchNis}
                                            onChange={(e) =>
                                                setSearchNis(e.target.value)
                                            }
                                            onKeyDown={(e) =>
                                                e.key === "Enter" &&
                                                handleSearch()
                                            }
                                            disabled={isSearching}
                                        />
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
                                            search
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSearch}
                                    disabled={isSearching}
                                    className="w-full py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold rounded-lg transition-colors border border-outline-variant disabled:opacity-50 flex items-center justify-center"
                                >
                                    {isSearching ? (
                                        <span className="material-symbols-outlined animate-spin mr-2">
                                            progress_activity
                                        </span>
                                    ) : (
                                        "Cari Data"
                                    )}
                                </button>
                            </div>
                        </div>

                        {student && (
                            <div className="bg-primary-fixed/20 rounded-2xl p-6 border border-primary-fixed shadow-sm">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center font-bold text-xl uppercase">
                                        {student.name.substring(0, 2)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-on-surface text-lg leading-tight">
                                            {student.name}
                                        </h4>
                                        <p className="text-sm text-on-surface-variant">
                                            {student.student_class?.name || "-"}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2 pt-4 border-t border-primary-fixed-dim/30 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-on-surface-variant">
                                            Status:
                                        </span>
                                        <span className="font-semibold text-primary">
                                            {student.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-on-surface-variant">
                                            Total Tagihan:
                                        </span>
                                        <span className="font-semibold text-error">
                                            Rp{" "}
                                            {unpaidBills
                                                .reduce(
                                                    (acc, curr) =>
                                                        acc +
                                                        Number(curr.amount),
                                                    0,
                                                )
                                                .toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Payment Details */}
                    <div className="lg:col-span-8">
                        <div
                            className={cn(
                                "bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm transition-all duration-300",
                                !student && "opacity-50 pointer-events-none",
                            )}
                        >
                            <h3 className="font-headline-md mb-6 text-on-surface flex justify-between items-center">
                                <span>Tagihan Belum Dibayar</span>
                                {unpaidBills.length > 0 && (
                                    <div className="flex gap-3">
                                        {unpaidBills.filter(
                                            (b) =>
                                                b.bill_type?.name?.toUpperCase() ===
                                                "SPP",
                                        ).length >= 6 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    selectSppMonths(6)
                                                }
                                                className="text-xs font-semibold text-primary bg-primary-container px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors"
                                            >
                                                Lunas 1 Semester
                                            </button>
                                        )}
                                        {unpaidBills.filter(
                                            (b) =>
                                                b.bill_type?.name?.toUpperCase() ===
                                                "SPP",
                                        ).length >= 12 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    selectSppMonths(12)
                                                }
                                                className="text-xs font-semibold text-primary bg-primary-container px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors"
                                            >
                                                Lunas 1 Tahun
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={selectAllBills}
                                            className="text-xs font-semibold text-on-surface-variant border border-outline-variant px-3 py-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
                                        >
                                            Pilih Semua
                                        </button>
                                    </div>
                                )}
                            </h3>

                            <form
                                onSubmit={handlePayment}
                                className="space-y-6"
                            >
                                {unpaidBills.length === 0 ? (
                                    <div className="text-center p-8 bg-surface-container-lowest rounded-xl border border-outline-variant border-dashed">
                                        <span className="material-symbols-outlined text-4xl text-outline mb-2">
                                            check_circle
                                        </span>
                                        <p className="text-on-surface-variant font-medium">
                                            Tidak ada tagihan yang belum
                                            dibayar.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                        {unpaidBills.map((bill) => (
                                            <div
                                                key={bill.id}
                                                onClick={() =>
                                                    toggleBill(bill.id)
                                                }
                                                className={cn(
                                                    "p-4 rounded-xl border cursor-pointer transition-colors flex items-center justify-between",
                                                    selectedBillIds.includes(
                                                        bill.id,
                                                    )
                                                        ? "bg-primary-container/30 border-primary"
                                                        : "bg-surface-container-lowest border-outline-variant hover:border-primary/50",
                                                )}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className={cn(
                                                            "w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors",
                                                            selectedBillIds.includes(
                                                                bill.id,
                                                            )
                                                                ? "bg-primary border-primary text-on-primary"
                                                                : "border-outline",
                                                        )}
                                                    >
                                                        {selectedBillIds.includes(
                                                            bill.id,
                                                        ) && (
                                                            <span className="material-symbols-outlined text-[14px] font-bold">
                                                                check
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-on-surface">
                                                            {
                                                                bill.bill_type
                                                                    ?.name
                                                            }{" "}
                                                            {bill.period
                                                                ? `(${bill.period})`
                                                                : ""}
                                                        </p>
                                                        <p className="text-xs text-on-surface-variant">
                                                            Tenggat:{" "}
                                                            {new Date(
                                                                bill.due_date,
                                                            ).toLocaleDateString(
                                                                "id-ID",
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="font-bold text-on-surface text-right">
                                                    Rp{" "}
                                                    {bill.amount?.toLocaleString(
                                                        "id-ID",
                                                    )}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {unpaidBills.length > 0 && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2 mt-4">
                                                Metode Pembayaran
                                            </label>
                                            <select
                                                className="w-full px-4 py-3 border border-outline-variant rounded-lg bg-surface focus:border-primary outline-none appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231b1c19%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:12px_12px] bg-[right_16px_center]"
                                                value={paymentMethod}
                                                onChange={(e) =>
                                                    setPaymentMethod(
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                <option value="CASH">
                                                    Tunai (Cash)
                                                </option>
                                                <option value="TRANSFER">
                                                    Transfer Bank
                                                </option>
                                                <option value="QRIS">
                                                    QRIS
                                                </option>
                                            </select>
                                        </div>

                                        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant flex justify-between items-center mt-6">
                                            <div>
                                                <p className="text-sm font-medium text-on-surface-variant mb-1">
                                                    Total yang akan dibayar
                                                </p>
                                                <p className="text-3xl font-bold text-primary">
                                                    Rp{" "}
                                                    {totalAmount.toLocaleString(
                                                        "id-ID",
                                                    )}
                                                </p>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={
                                                    isProcessing ||
                                                    totalAmount === 0
                                                }
                                                className={cn(
                                                    "py-3 px-8 rounded-xl font-bold transition-all shadow-sm flex items-center",
                                                    isProcessing ||
                                                        totalAmount === 0
                                                        ? "bg-outline text-surface cursor-not-allowed"
                                                        : "bg-primary text-on-primary hover:bg-primary-container hover:shadow-md hover:-translate-y-0.5",
                                                )}
                                            >
                                                {isProcessing
                                                    ? "Memproses..."
                                                    : "Proses Pembayaran"}
                                                {!isProcessing && (
                                                    <span className="material-symbols-outlined ml-2 text-[20px]">
                                                        payments
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
