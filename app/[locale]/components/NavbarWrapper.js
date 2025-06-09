'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarWrapper({ locale }) {
    const pathname = usePathname();
    const hideOnDashboard = pathname.startsWith(`/${locale}/dashboard`);
    if (hideOnDashboard) return null;

    return <Navbar locale={locale} />;
}