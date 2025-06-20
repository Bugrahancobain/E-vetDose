'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from "./components/sidebar"
import ServiceWorkerRegistrar from "./components/ServiceWorkerRegistrar";

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
        <>
            <Sidebar locale={locale} />

            <div
                className="dashboardWrapper"
                style={{
                    backgroundColor: "#f5f8ef",
                    marginLeft: '100px',
                    padding: '20px',
                    minHeight: '100vh',
                }}
            >
                <ServiceWorkerRegistrar />
                {children}
            </div>
        </>
    );
}

