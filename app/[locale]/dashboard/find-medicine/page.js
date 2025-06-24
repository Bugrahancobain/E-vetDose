"use client";

import React, { useState } from "react";
import styles from "./FindMedicine.module.css";
import medicationsData from "../../../../data/medications.json";
import anamnesisData from "../../../../data/anamnesis.json";
import Link from "next/link";
import { useLocale } from 'next-intl';
import { useUserAccess } from "../../../../app/hooks/useUserAccess";
import { useRouter } from "next/navigation"; // en üstte olmalı
import { useParams } from "next/navigation"; // varsa tekrar import etme



export default function FindMedicine() {
    const { hasAccess, trialExpired } = useUserAccess("basic");
    const params = useParams();
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [filteredMedications, setFilteredMedications] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const locale = useLocale();


    const toggleCategory = (categoryId) => {
        setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
    };

    const handleToggleOption = (id) => {
        setSelectedOptions((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleFilter = () => {
        const filtered = medicationsData.medications.filter((medication) =>
            medication.conditions.some((id) => selectedOptions.includes(id))
        );
        setFilteredMedications(filtered);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setFilteredMedications([]);
    };

    const resetSelections = () => {
        setSelectedOptions([]);
    };

    const filteredCategories = anamnesisData.categories
        .map((category) => ({
            ...category,
            options: category.options.filter((option) =>
                option.label.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        }))
        .filter(
            (category) =>
                category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                category.options.length > 0
        );

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
        <div className={styles.container}>
            <h1 className={styles.title}>Anamnez Formu</h1>

            <input
                className={styles.searchInput}
                placeholder="Anamnez Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className={styles.gridWrapper}>
                {filteredCategories.map((category) => (
                    <div style={{ backgroundColor: "transparent" }} key={category.id}>
                        <div
                            className={styles.categoryHeader}
                            onClick={() => toggleCategory(category.id)}
                        >
                            <span className={styles.categoryTitle}>{category.name}</span>
                        </div>

                        {expandedCategory === category.id && (
                            <div className={styles.optionsContainer}>
                                {category.options.map((option) => (
                                    <div
                                        key={option.id}
                                        className={styles.optionContainer}
                                        onClick={() => handleToggleOption(option.id)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedOptions.includes(option.id)}
                                            onChange={() => handleToggleOption(option.id)}
                                        />
                                        <span className={styles.optionLabel}>{option.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className={styles.buttonContainer}>
                <button className={styles.clearButton} onClick={resetSelections}>
                    Seçimleri Temizle
                </button>
                <button className={styles.filterButton} onClick={handleFilter}>
                    Filtrele
                </button>
            </div>

            {showPopup && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popup}>
                        <button className={styles.closeButton} onClick={handleClosePopup}>
                            X
                        </button>
                        <h2 className={styles.resultTitle}>Önerilen İlaçlar</h2>
                        <div className={styles.scrollArea}>
                            {filteredMedications.map((medication) => (
                                <div key={medication.id} className={styles.medicationItem}>
                                    <h3 className={styles.medicationName}>{medication.name}</h3>
                                    <p>
                                        <strong>Kullanım Alanı:</strong> {medication.description}
                                    </p>
                                    <p>
                                        <strong>Yan Etkiler:</strong> {medication.sideEffects}
                                    </p>
                                    <Link
                                        href={`/${locale}/dashboard/drugs/${medication.id}`}
                                        className={styles.detailButton}
                                        onClick={handleClosePopup}
                                    >
                                        Detaylı İncele
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}