import React, { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Toaster, toast } from 'sonner';

export default function FlashToaster() {
    const { flash } = usePage().props as any;

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;
        
        if (flash?.success) {
            timeoutId = setTimeout(() => toast.success(flash.success), 50);
        }
        if (flash?.error) {
            timeoutId = setTimeout(() => toast.error(flash.error), 50);
        }
        
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [flash?.success, flash?.error]);

    return <Toaster position="top-right" richColors />;
}
