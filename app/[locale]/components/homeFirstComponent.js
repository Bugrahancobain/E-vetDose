'use client';

import Link from 'next/link';
import React from 'react';
import { IoLogoAppleAppstore, IoLogoGooglePlaystore } from 'react-icons/io5';
import { FaStar } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import "../styles/homeFirstComponent.css"

function HomeFirstComponent({ locale }) {
    const t = useTranslations('homeFirstComponent');

    return (
        <div className='homeFirstComponentMain'>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: "0 20px" }}>
                <div className='appMarketMain'>
                    <div className='appMarketDiv'>
                        <Link href="#" target="_blank">
                            <IoLogoAppleAppstore /> {t('apple')}
                        </Link>
                        <div className='starIcon'><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                    </div>
                    <div className='appMarketDiv'>
                        <Link href="#" target="_blank">
                            <IoLogoGooglePlaystore /> {t('google')}
                        </Link>
                        <div className='starIcon'><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                    </div>
                </div>
                <span className='trusted'>{t('trusted')}</span>
            </div>
            <div className='homeFirstComponentFeaturesWrap'>
                <h1>{t('title')}</h1>
                <h2>{t('features')}</h2>
                <Link href={`/${locale}/login`}>{t('demo')}</Link>
            </div>
        </div>
    );
}

export default HomeFirstComponent;