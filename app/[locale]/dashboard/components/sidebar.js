'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';
import "../styles/sidebar.css";
import { signOut } from "firebase/auth";
import { auth } from "../../../../firebase";
import { useRouter } from 'next/navigation';

function Sidebar({ locale, isOpen, onLinkClick }) {
    const t = useTranslations('navbar');
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push(`/${locale}/login`);
        } catch (error) {
            console.error("Çıkış işlemi başarısız:", error);
        }
    };

    const handleLinkClick = () => {
        if (onLinkClick) {
            onLinkClick(); // sidebar'ı kapat
        }
    };

    return (
        <div className={`dashboardSideBarMain ${isOpen ? 'open' : ''}`}>
            <div>
                <Link href={`/${locale}/dashboard`} className='dashboardSideBarImgDiv' onClick={handleLinkClick}>
                    <img className='dashboardSideBarImg' src="/Logo.png" alt="Logo.png" />
                </Link>
                <div className='dashboardSideBarLinkDiv'>
                    <Link href={`/${locale}/dashboard`} onClick={handleLinkClick}>Anasayfa</Link>
                    <Link href={`/${locale}/dashboard/dosage`} onClick={handleLinkClick}>Dozaj Hesapla</Link>
                    <Link href={`/${locale}/dashboard/drugs`} onClick={handleLinkClick}>İlaç Kütüphanesi</Link>
                    <Link href={`/${locale}/dashboard/find-medicine`} onClick={handleLinkClick}>İlacını Bul</Link>
                    <Link href={`/${locale}/dashboard/cc`} onClick={handleLinkClick}>Birim Çevir</Link>
                    <Link href={`/${locale}/dashboard/alarms`} onClick={handleLinkClick}>Alarm Kur</Link>
                    <Link href={`/${locale}/dashboard/assistant`} onClick={handleLinkClick}>AI Asistan</Link>
                </div>
            </div>
            <div>
                <Link href={`/${locale}/dashboard/profile`} onClick={handleLinkClick}>Settings</Link>
                <button onClick={handleLogout} className='dashboardSideBarQuit'>
                    Çıkış
                </button>
            </div>
        </div>
    );
}

export default Sidebar;