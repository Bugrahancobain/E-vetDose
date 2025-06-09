'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase';
import { useRouter, useParams } from 'next/navigation';

export default function DashboardLayout({ children }) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale || 'en'; // Default locale fallback

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.replace(`/${locale}/login`);
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router, locale]);

    if (loading) {
        return <div className="authLoading">Yükleniyor...</div>; // İstersen spinner da koyabiliriz
    }

    return (
        <div className="dashboardWrapper">
            {/* Buraya ortak bileşenler (Sidebar, Navbar) eklenebilir */}
            {children}
        </div>
    );
}