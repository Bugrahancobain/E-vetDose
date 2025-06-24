'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from "./components/sidebar";
import ServiceWorkerRegistrar from "./components/ServiceWorkerRegistrar";
import { UserProvider } from "../../../context/UserContext";

export default function DashboardLayout({ children }) {
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale || 'en';

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.replace(`/${locale}/login`);
            } else {
                setLoading(false);
            }
        });

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            unsubscribe();
            window.removeEventListener('resize', handleResize);
        };
    }, [router, locale]);

    if (loading) return <div className="authLoading">Yükleniyor...</div>;

    return (
        <>
            {isMobile && (
                <button
                    className="mobileMenuButton"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    ☰
                </button>
            )}

            <Sidebar locale={locale} isOpen={sidebarOpen} onLinkClick={() => setSidebarOpen(false)} />

            <div
                className="dashboardWrapper"
                style={{
                    backgroundColor: "#f5f8ef",
                    marginLeft: isMobile ? '0' : '100px',
                    padding: '20px',
                    minHeight: '100vh',
                }}
                onClick={() => isMobile && sidebarOpen && setSidebarOpen(false)}
            >
                <ServiceWorkerRegistrar />
                <UserProvider>{children}</UserProvider>
            </div>
        </>
    );
}