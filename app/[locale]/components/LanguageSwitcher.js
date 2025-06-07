'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const currentLocale = useLocale();

    const changeLanguage = (lang) => {
        const segments = pathname.split('/');
        segments[1] = lang; // /tr/sayfa gibi yapının 2. segmenti
        router.push(segments.join('/'));
    };

    return (
        <select
            value={currentLocale}
            onChange={(e) => changeLanguage(e.target.value)}
            style={{ marginLeft: '1rem', padding: '4px 8px', borderRadius: '4px' }}
        >
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
        </select>
    );
}