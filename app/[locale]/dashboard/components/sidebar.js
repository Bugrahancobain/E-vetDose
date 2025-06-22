'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';
import "../styles/sidebar.css";
import { signOut } from "firebase/auth";
import { auth } from "../../../../firebase"; // 🔹 Burada firebase.js dosyasından auth çekiyoruz
import { useRouter } from 'next/navigation';

function Sidebar({ locale }) {
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

    return (
        <div className='dashboardSideBarMain'>
            <div>
                <Link href={`/${locale}/dashboard`} className='dashboardSideBarImgDiv'>
                    <img className='dashboardSideBarImg' src="/Logo.png" alt="Logo.png" />
                </Link>
                <div className='dashboardSideBarLinkDiv'>
                    <Link href={`/${locale}/dashboard`} >Anasayfa</Link>
                    <Link href={`/${locale}/dashboard/dosage`} >Dozaj Hesapla</Link>
                    <Link href={`/${locale}/dashboard/drugs`} >İlaç Kütüphanesi</Link>
                    <Link href={`/${locale}/dashboard/find-medicine`} >İlacını Bul</Link>
                    <Link href={`/${locale}/dashboard/cc`} >Birim Çevir</Link>
                    <Link href={`/${locale}/dashboard/alarms`} >Alarm Kur</Link>
                    <Link href={`/${locale}/dashboard/assistant`} >AI Asistan</Link>
                </div>
            </div>
            <div>
                <Link href={`/${locale}/dashboard/profile`} >Settings</Link>
                <button onClick={handleLogout} className='dashboardSideBarQuit'>
                    Çıkış
                </button>
            </div>
        </div>
    );
}

export default Sidebar;