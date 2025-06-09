'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import "../styles/navbar.css";
import LanguageSwitcher from './LanguageSwitcher';

function Navbar({ locale }) {
    const t = useTranslations('navbar');

    return (
        <div className='navbarMain'>
            <div className='navbarLogoDiv'>
                <Link href={`/${locale}/`}>
                    <img className='nambarLogoImg' src="/Logo.png" alt="E-VetDose_Logo" />
                </Link>
            </div>
            <div className='navbarLink'>
                <Link href={`/${locale}/`}>{t('home')}</Link>
                <Link href={`/${locale}/aboutUs`}>{t('about')}</Link>
                <Link locale={locale} href={`/${locale}/pricing`}>{t('pricing')}</Link>
                <Link href={`/${locale}/blog`}>{t('blog')}</Link>
                <Link href={`/${locale}/contact`}>{t('contact')}</Link>
            </div>
            <div className='navbarLogin'>
                <LanguageSwitcher />
                <Link locale={locale} href={`/${locale}/login`}>{t('login')}</Link>
            </div>
        </div>
    );
}

export default Navbar;