import { useTranslations } from 'next-intl';
import Link from 'next/link'
import React from 'react'
import "../styles/sidebar.css"

function sidebar({ locale }) {
    const t = useTranslations('navbar');
    return (
        <div className='dashboardSideBarMain'>
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
    )
}

export default sidebar