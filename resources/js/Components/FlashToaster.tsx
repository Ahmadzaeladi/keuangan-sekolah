import React, { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Toaster, toast } from 'sonner';

export default function FlashToaster() {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return <Toaster position="top-right" richColors />;
}
