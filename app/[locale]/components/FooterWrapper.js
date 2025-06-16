'use client';
import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function FooterWrapper({ locale }) {
    const pathname = usePathname();
    const hideOnDashboard = pathname.startsWith(`/${locale}/dashboard`);
    if (hideOnDashboard) return null;

    return <Footer locale={locale} />;
}