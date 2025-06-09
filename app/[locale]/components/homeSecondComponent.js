"use client";
import { useTranslations } from 'next-intl';
import Link from 'next/link'
import React from 'react'
import "../styles/homeSecondComponent.css"


function homeSecondComponent({ locale }) {
    const t = useTranslations('homeSecondComponent');

    return (
        <div className='homeSecondComponentMain'>
            <div className='homeSecondComponentImageWrap'>
                <img className='homeSecondComponentImage' src="/homeSecondComponentImage.webp" alt="homeSecondComponentImage" />
            </div>
            <Link className='homeSecondComponentBtn' href={`/${locale}/login`}>{t('demo')}</Link>
        </div>
    )
}

export default homeSecondComponent