"use client";

import React from 'react';
import "../styles/homeReady.css";
import Link from 'next/link';
import { useTranslations } from 'next-intl';

function homeReady({ locale }) {
    const t = useTranslations('homeReady');

    return (
        <div className='homeReadyMain'>
            <div className='homeReadyDiv'>
                <h2>{t('title')}</h2>
                <span>{t('subtitle')}</span>
                <Link className='homeBlogBtn' href={`/${locale}/login`}>
                    {t('demo')}
                </Link>
            </div>
        </div>
    );
}

export default homeReady;