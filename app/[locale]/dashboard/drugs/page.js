'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import medications from '../../../../data/medicationsDetailsData.json';
import styles from './Drugs.module.css';
import { useRouter } from "next/navigation"; // en üstte olmalı
import { useUserAccess } from "../../../../app/hooks/useUserAccess";

const ITEMS_PER_PAGE = 15;

export default function MedicationList() {
    const { hasAccess, trialExpired, isLoading, user } = useUserAccess("basic");
    const router = useRouter();
    const { locale } = useParams();
    const [search, setSearch] = useState('');
    const [filtered, setFiltered] = useState(medications);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const lower = search.toLowerCase();

        const results = medications.filter((med) => {
            const ticari = med.details?.ticari_ürünler;
            const vetEtiketli = med.details?.regülasyon?.veteriner_etiketli_ürünler;
            const insanEtiketli = med.details?.regülasyon?.insan_etiketli_ürünler;

            return (
                med.name?.toLowerCase().includes(lower) ||
                (Array.isArray(ticari) && ticari.some((item) => item.toLowerCase().includes(lower))) ||
                (Array.isArray(vetEtiketli)
                    ? vetEtiketli.some((item) => item.toLowerCase().includes(lower))
                    : typeof vetEtiketli === 'string' && vetEtiketli.toLowerCase().includes(lower)) ||
                (Array.isArray(insanEtiketli)
                    ? insanEtiketli.some((item) => item.toLowerCase().includes(lower))
                    : typeof insanEtiketli === 'string' && insanEtiketli.toLowerCase().includes(lower))
            );
        });

        setFiltered(results);
        setCurrentPage(1);
    }, [search]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginatedItems = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading || !user) {
        return (
            <div className={styles.loadingWrapper}>
                <div className={styles.spinner}></div>
                <p className={styles.loadingText}>Veriler yükleniyor, lütfen bekleyin...</p>
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    background: "linear-gradient(to bottom right, #f5f7fa, #c3cfe2)",
                    padding: "40px",
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#fff",
                        borderRadius: "16px",
                        padding: "40px",
                        maxWidth: "600px",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "24px",
                    }}
                >
                    <h2 style={{ fontSize: "1.5rem", color: "#e63946", fontWeight: "700" }}>
                        {trialExpired ? "🚫 Deneme Süresi Sona Erdi" : "❌ Erişim Engellendi"}
                    </h2>

                    <p style={{ fontSize: "1.1rem", color: "#333" }}>
                        {trialExpired
                            ? "Deneme süreniz doldu. Lütfen bir plan seçmek için profil sayfanıza gidin."
                            : "Bu sayfaya erişiminiz yok. Aboneliğinizi kontrol etmek için profil sayfanıza gidebilirsiniz."}
                    </p>

                    <button
                        onClick={() => router.push(`/${locale}/dashboard/profile`)}
                        style={{
                            padding: "12px 24px",
                            backgroundColor: "#0070f3",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "1rem",
                            fontWeight: "600",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                            transition: "all 0.3s ease",
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#0059c9"}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#0070f3"}
                    >
                        👤 Profili Görüntüle
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>💊 İlaç Kütüphanesi</h1>
            <input
                className={styles.search}
                placeholder="İlaç adı veya ürün ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className={styles.grid}>
                {paginatedItems.map((med) => (
                    <Link key={med.id} href={`/${locale}/dashboard/drugs/${med.id}`} className={styles.card}>
                        <img src={med.image} alt={med.name} className={styles.image} />
                        <h3>{med.name}</h3>
                        <p>{med.description}</p>
                    </Link>
                ))}
            </div>

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    {/* İlk sayfa */}
                    {currentPage !== 1 && (
                        <>
                            <button
                                className={`${styles.pageButton} ${currentPage === 1 ? styles.active : ''}`}
                                onClick={() => handlePageChange(1)}
                            >
                                1
                            </button>
                            {currentPage > 4 && <span className={styles.ellipsis}>...</span>}
                        </>
                    )}

                    {/* Ortadaki dinamik sayfalar */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                            (page) =>
                                page === currentPage ||
                                (page >= currentPage - 3 && page <= currentPage + 3)
                        )
                        .map((page) => (
                            <button
                                key={page}
                                className={`${styles.pageButton} ${page === currentPage ? styles.active : ''}`}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </button>
                        ))}

                    {/* Son sayfa */}
                    {currentPage < totalPages - 3 && (
                        <>
                            {currentPage < totalPages - 3 && <span className={styles.ellipsis}>...</span>}
                            <button
                                className={`${styles.pageButton} ${currentPage === totalPages ? styles.active : ''}`}
                                onClick={() => handlePageChange(totalPages)}
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}