"use client";

import React from 'react';
import { FaPaw } from "react-icons/fa";
import { LuDollarSign, LuAlarmClock } from "react-icons/lu";
import { FaRegClock } from "react-icons/fa6";
import { TbPigMoney } from "react-icons/tb";
import { MdPhoneIphone } from "react-icons/md";
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import "../styles/homeThirdComponent.css";

function homeThirdComponent({ locale }) {
    const t = useTranslations('homeThirdComponent');

    return (
        <div className='homeThirdComponentMain'>
            <div className='homeThirdComponentFirstDiv'>
                <div>
                    <FaPaw />
                    <h2>{t('stat1Title')}</h2>
                    <span>{t('stat1Text')}</span>
                </div>
                <div>
                    <LuDollarSign />
                    <h2>{t('stat2Title')}</h2>
                    <span>{t('stat2Text')}</span>
                </div>
                <div>
                    <FaRegClock />
                    <h2>{t('stat3Title')}</h2>
                    <span>{t('stat3Text')}</span>
                </div>
            </div>

            <div className='homeThirdComponentSecondDiv'>
                <span>{t('sectionTitle')}</span>
                <h2>{t('sectionHeading')}</h2>
                <h3>{t('sectionSubtext')}</h3>
            </div>

            <div className='homeThirdComponentThirdDiv'>
                <div>
                    <LuAlarmClock />
                    <h2>{t('box1Title')}</h2>
                    <span>{t('box1Text')}</span>
                </div>
                <div>
                    <TbPigMoney />
                    <h2>{t('box2Title')}</h2>
                    <span>{t('box2Text')}</span>
                </div>
                <div>
                    <MdPhoneIphone />
                    <h2>{t('box3Title')}</h2>
                    <span>{t('box3Text')}</span>
                </div>
            </div>

            <Link className='homeThirdComponentBtn' href={`/${locale}/login`}>
                {t('demo')}
            </Link>
        </div>
    );
}

export default homeThirdComponent;