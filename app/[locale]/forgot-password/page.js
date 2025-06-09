'use client';

import React, { useState } from 'react';
import './forgot-password.css';
import { auth } from '../../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale;
    const t = useTranslations('forgot-password');

    const handleReset = async (e) => {
        e.preventDefault();
        if (!email) return alert(t('alertEmpty'));

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            alert(t('alertSuccess'));
            router.replace(`/${locale}/login`);
        } catch (error) {
            alert(`${t('alertError')}: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgotContainer">
            <form onSubmit={handleReset} className="forgotForm">
                <h1 className="forgotTitle">{t('title')}</h1>
                <p className="forgotDesc">{t('description')}</p>
                <input
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    className="forgotInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="forgotButton" disabled={loading}>
                    {loading ? t('submitting') : t('submit')}
                </button>
                <p className="backToLogin">
                    <a href={`/${locale}/login`}>{t('backToLogin')}</a>
                </p>
            </form>
        </div>
    );
}