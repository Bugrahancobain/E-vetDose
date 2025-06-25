'use client';
import React, { useState } from 'react';
import './register.css';
import { auth } from '../../../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
    const t = useTranslations('register');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    const router = useRouter();
    const params = useParams();
    const locale = params?.locale;

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!termsAccepted) return alert('Please accept the terms.');
        if (!fullName || !email || !password || !confirmPassword) return alert('Please fill in all fields.');
        if (password !== confirmPassword) return alert('Passwords do not match.');

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await sendEmailVerification(user);
            await updateProfile(user, { displayName: fullName });

            await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid: user.uid,
                    fullName,
                    email,
                }),
            });

            alert('Account created. Please verify your email.');
            router.replace(`/${locale}/login`);
        } catch (error) {
            alert('Registration failed!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registerContainer">
            <form onSubmit={handleRegister} className="registerForm">
                <h1 className="registerTitle">{t('title')}</h1>
                <input type="text" placeholder={t('namePlaceholder')} value={fullName} onChange={e => setFullName(e.target.value)} className="registerInput" required />
                <input type="email" placeholder={t('emailPlaceholder')} value={email} onChange={e => setEmail(e.target.value)} className="registerInput" required />
                <input type="password" placeholder={t('passwordPlaceholder')} value={password} onChange={e => setPassword(e.target.value)} className="registerInput" required />
                <input type="password" placeholder={t('confirmPasswordPlaceholder')} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="registerInput" required />
                <div className="registerCheckbox">
                    <input type="checkbox" checked={termsAccepted} onChange={() => setTermsAccepted(prev => !prev)} required />
                    <span onClick={() => setShowTerms(true)} className="termsText">{t('termsText')}</span>                </div>
                <button type="submit" className="registerButton" disabled={loading}>
                    {loading ? t('submitting') : t('submit')}
                </button>
                <p className="registerLoginRedirect">
                    {t('loginRedirect')} <a href={`/${locale}/login`}><span>{t('loginLink')}</span></a>
                </p>
            </form>

            {showTerms && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <h2 className="modalTitle">{t('termsTitle')}</h2>
                        <div className="modalText">
                            <p>
                                Bu uygulama, veteriner hekimler için pratik bir yardımcı araç olarak geliştirilmiştir. Ancak içerikte yer alan dozaj hesaplamaları, ilaç bilgileri ve yönlendirmeler yalnızca genel bilgilendirme amacı taşır.
                            </p>
                            <p>
                                Uygulamada sunulan bilgiler tıbbi tavsiye yerine geçmez ve doğruluğu garanti edilmez. Her kullanıcının, verdiği kararların ve uygulamaların sorumluluğu tamamen kendisine aittir.
                            </p>
                            <p>
                                Bu uygulamanın kullanımı sonucu doğabilecek doğrudan veya dolaylı herhangi bir sağlık problemi, yasal uyuşmazlık, mesleki zarar veya üçüncü şahıslarla yaşanabilecek sorunlardan geliştirici ve yayıncı hiçbir şekilde sorumlu tutulamaz.
                            </p>
                            <p>
                                Bu uygulamayı kullanarak, yukarıdaki maddeleri okuduğunuzu, anladığınızı ve tüm sorumluluğun tarafınıza ait olduğunu kabul etmiş sayılırsınız.
                            </p>
                        </div>
                        <button className="modalButton" onClick={() => {
                            setTermsAccepted(true);
                            setShowTerms(false);
                        }}>{t('termsAccept')}</button>
                    </div>
                </div>
            )}
        </div>
    );
}