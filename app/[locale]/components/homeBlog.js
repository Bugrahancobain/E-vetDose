"use client";

import React from 'react';
import "../styles/homeBlog.css";
import { useTranslations } from 'next-intl';
import Link from 'next/link';

function homeBlog({ locale }) {
    const t = useTranslations('homeBlog');

    return (
        <div className='homeBlogMain'>
            <div className='homeBlogTitleWraper'>
                <h2>{t('title')}</h2>
                <span>{t('subtitle')}</span>
            </div>
            <div className='homeBlogCardWraper'>
                {/* Blog kartları buraya eklenecek */}
            </div>
            <Link className='homeBlogBtn' href={`/${locale}/login`}>
                {t('demo')}
            </Link>
        </div>
    );
}

export default homeBlog;