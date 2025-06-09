'use client';

import React, { useState } from 'react';
import './login.css';
import { auth } from '../../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
    const t = useTranslations('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const params = useParams();
    const locale = params?.locale;

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert(t('errorEmpty'));
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace(`/${locale}/dashboard`);
        } catch (error) {
            alert(t('errorLogin'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="loginContainer">
            <form onSubmit={handleLogin} className="loginForm">
                <h1 className="loginTitle">{t('title')}</h1>
                <input
                    type="email"
                    className="loginInput"
                    placeholder={t('emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    className="loginInput"
                    placeholder={t('passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="loginButton" disabled={loading}>
                    {loading ? t('submitting') : t('submit')}
                </button>
                <div className="loginLinks">
                    <a href={`/${locale}/forgot-password`} className="loginLink">{t('forgotPassword')}</a>
                    <a href={`/${locale}/register`} className="loginLink">
                        {t('registerPrompt')} <span>{t('registerLink')}</span>
                    </a>
                </div>
            </form>
        </div>
    );
}