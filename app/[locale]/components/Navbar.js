'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import "../styles/navbar.css";
import LanguageSwitcher from './LanguageSwitcher';

function Navbar({ locale }) {
    const t = useTranslations('navbar');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    return (
        <div className='navbarMain'>
            <div className='navbarLogoDiv'>
                <Link href={`/${locale}/`}>
                    <img className='nambarLogoImg' src="/Logo.png" alt="E-VetDose_Logo" />
                </Link>
            </div>
            <div className={`navbarLink ${isMenuOpen ? 'open' : ''}`}>
                <Link onClick={() => setIsMenuOpen(false)} href={`/${locale}/`}>{t('home')}</Link>
                <Link onClick={() => setIsMenuOpen(false)} href={`/${locale}/aboutUs`}>{t('about')}</Link>
                <Link onClick={() => setIsMenuOpen(false)} href={`/${locale}/pricing`}>{t('pricing')}</Link>
                <Link onClick={() => setIsMenuOpen(false)} href={`/${locale}/blog`}>{t('blog')}</Link>
                <Link onClick={() => setIsMenuOpen(false)} href={`/${locale}/contact`}>{t('contact')}</Link>
                <Link onClick={() => setIsMenuOpen(false)} href={`/${locale}/dashboard`}>{t('login')}</Link>
            </div>
            <div className='navbarLogin'>
                <LanguageSwitcher />
                <button className="burgerButton" onClick={toggleMenu}>
                    ☰
                </button>
            </div>
        </div>
    );
}

export default Navbar;