"use client";
import medications from '../../../../../data/medicationsDetailsData.json';
import styles from './DrugsDetails.module.css';
import { useRouter } from "next/navigation"; // en üstte olmalı
import { useParams } from "next/navigation"; // varsa tekrar import etme
import { useUserAccess } from '../../../../hooks/useUserAccess'; // kullanıcı erişim kontrolü için hook
export default function MedicationDetails() {
    const { hasAccess, trialExpired } = useUserAccess("basic");
    const params = useParams();
    const locale = params?.locale || 'en';
    const med = medications.find((m) => m.id === params.id);


    if (!med) return <div>İlaç bulunamadı.</div>;

    const formatKey = (key) => key.replace(/_/g, ' ').toUpperCase();

    const renderValue = (value) => {
        const renderValue = (value) => {
            if (typeof value === 'string') return <p>{value}</p>;

            if (Array.isArray(value)) {
                return (
                    <ul className={styles.list}>
                        {value.map((item, i) =>
                            typeof item === 'object' ? (
                                <li key={i} className={styles.listItem}>
                                    {Object.entries(item).map(([k, v]) => (
                                        <p key={k}><b>{formatKey(k)}:</b> {v}</p>
                                    ))}
                                </li>
                            ) : (
                                <li key={i} className={styles.listItem}>• {item}</li>
                            )
                        )}
                    </ul>
                );
            }

            if (typeof value === 'object') {
                return Object.entries(value).map(([k, v]) => (
                    <div key={k}>
                        <h4>{formatKey(k)}</h4>
                        {renderValue(v)}
                    </div>
                ));
            }

            return null;
        };
        if (typeof value === 'string') return <p>{value}</p>;
        if (Array.isArray(value)) {
            return (
                <ul>
                    {value.map((item, i) =>
                        typeof item === 'object' ? (
                            <li key={i}>
                                {Object.entries(item).map(([k, v]) => (
                                    <p key={k}><b>{formatKey(k)}:</b> {v}</p>
                                ))}
                            </li>
                        ) : (
                            <li key={i}>• {item}</li>
                        )
                    )}
                </ul>
            );
        }
        if (typeof value === 'object') {
            return Object.entries(value).map(([k, v]) => (
                <div key={k}>
                    <h4>{formatKey(k)}</h4>
                    {renderValue(v)}
                </div>
            ));
        }
        return null;
    };

    // ...

    if (!hasAccess) {
        const router = useRouter();

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
        <div className={styles.detailContainer}>
            <h1 className={styles.title}>{med.name}</h1>
            {Object.entries(med.details).map(([key, value]) => (
                <div key={key} className={styles.section}>
                    <h2>{formatKey(key)}</h2>
                    {renderValue(value)}
                </div>
            ))}
        </div>
    );
}