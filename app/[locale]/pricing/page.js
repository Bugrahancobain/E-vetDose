'use client';

import React, { useState } from 'react';
import './pricing.css';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function PricingPage() {
    const t = useTranslations('pricing');
    const { locale } = useParams();
    const [isYearly, setIsYearly] = useState(true);

    const formatPrice = (monthlyPrice) => {
        const price = isYearly ? monthlyPrice : monthlyPrice * 1.2;
        return `$${price.toFixed(2)}`;
    };

    return (
        <div className="pricingMain">
            <span className="pricingSubTitle">{t("subTitle")}</span>
            <h1 className="pricingTitle">{t("title")}</h1>
            <p className="pricingDesc">{t("desc")}</p>

            <div className="switchWrap">
                <span className={!isYearly ? 'active' : ''}>{t("monthly")}</span>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={isYearly}
                        onChange={() => setIsYearly(!isYearly)}
                    />
                    <span className="slider round"></span>
                </label>
                <span className={isYearly ? 'active' : ''}>
                    {t("annually")} <span className="discount">{t("discount")}</span>
                </span>
            </div>

            <div className="pricingCards">
                {/* Basic */}
                <div className="pricingCard">
                    <h3>{t("basicTitle")}</h3>
                    <p>{t("basicDesc")}</p>
                    <h2>{formatPrice(29.99)} <span>/{t("monthly")}</span></h2>
                    <Link href={`/${locale}/login`} className="btn">{t("basicBtn")}</Link>
                    <ul>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <li key={i}>{t(`basicFeatures.${i}`)}</li>
                        ))}
                    </ul>
                </div>

                {/* Professional */}
                <div className="pricingCard active">
                    <h3>{t("proTitle")}</h3>
                    <p>{t("proDesc")}</p>
                    <h2>{formatPrice(49.99)} <span>/{t("monthly")}</span></h2>
                    <Link href={`/${locale}/login`} className="btn btnPrimary">{t("proBtn")}</Link>
                    <ul>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <li key={i}>{t(`proFeatures.${i}`)}</li>
                        ))}
                    </ul>
                </div>

                {/* Enterprise */}
                <div className="pricingCard">
                    <h3>{t("enterpriseTitle")}</h3>
                    <p>{t("enterpriseDesc")}</p>
                    <h2>{formatPrice(99.99)} <span>/{t("monthly")}</span></h2>
                    <Link href={`/${locale}/login`} className="btn">{t("enterpriseBtn")}</Link>
                    <ul>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <li key={i}>{t(`enterpriseFeatures.${i}`)}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}