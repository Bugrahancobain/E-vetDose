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
            style={{ marginRight: '1rem', padding: '8px 12px', borderRadius: '12px', fontSize: "20px", borderColor: "white" }}
        >
            <option value="tr">🇹🇷</option>
            <option value="en">🇬🇧</option>
        </select>
    );
}