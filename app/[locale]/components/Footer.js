'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';
import "../styles/footer.css";
import { FaFacebookSquare, FaTwitterSquare, FaLinkedin, FaInstagram } from "react-icons/fa";

function Footer({ locale }) {
    const t = useTranslations('footer');
    const year = new Date().getFullYear();

    return (
        <div className='footerMain'>
            <Link href={`/${locale}/`}>
                <img className='footerLogo' src="/Logo.png" alt="E-vetDoseLogo.png" />
            </Link>

            <div className='footerInfo'>
                <div className='footerContactDiv'>
                    <h3>{t('followUs')}</h3>
                    <div>
                        <Link href="#" target='_blank'><FaFacebookSquare /></Link>
                        <Link href="#" target='_blank'><FaTwitterSquare /></Link>
                        <Link href="#" target='_blank'><FaLinkedin /></Link>
                        <Link href="#" target='_blank'><FaInstagram /></Link>
                    </div>
                </div>

                <div className='footerResourcesDiv'>
                    <h3>{t('resources')}</h3>
                    <div>
                        <Link href={`/${locale}/`}>{t('home')}</Link>
                        <Link href={`/${locale}/aboutUs`}>{t('about')}</Link>
                        <Link href={`/${locale}/pricing`}>{t('pricing')}</Link>
                        <Link href={`/${locale}/blog`}>{t('blog')}</Link>
                        <Link href={`/${locale}/contact`}>{t('contact')}</Link>
                    </div>
                </div>
            </div>

            <div className='footerBottom'>
                <div>© {year} E-VetDose App. {t('allRights')}</div>
                <div className='FooterPolicyDiv'>
                    <Link href={`/${locale}/`}>{t('privacyPolicy')}</Link>
                    <Link href={`/${locale}/`}>{t('termsOfService')}</Link>
                </div>
            </div>
        </div>
    );
}

export default Footer;