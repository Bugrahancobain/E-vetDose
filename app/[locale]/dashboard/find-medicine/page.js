"use client";

import React, { useState } from "react";
import styles from "./FindMedicine.module.css";
import medicationsData from "../../../../data/medications.json";
import anamnesisData from "../../../../data/anamnesis.json";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useUserAccess } from "../../../../app/hooks/useUserAccess";
import { useRouter, useParams } from "next/navigation";

export default function FindMedicine() {
    const { hasAccess, trialExpired, isLoading, user } = useUserAccess("basic");
    const router = useRouter();
    const params = useParams();
    const locale = useLocale();

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [filteredMedications, setFilteredMedications] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showPopup, setShowPopup] = useState(false);

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

    // 👉 Erişim sorgulanıyor
    if (isLoading || !user) {
        return (
            <div className={styles.loadingWrapper}>
                <div className={styles.spinner}></div>
                <p className={styles.loadingText}>Veriler yükleniyor, lütfen bekleyin...</p>
            </div>
        );
    }

    // ❌ Erişim yok
    if (!hasAccess) {
        return (
            <div className={styles.accessWrapper}>
                <div className={styles.accessCard}>
                    <h2 className={styles.accessTitle}>
                        {trialExpired ? "🚫 Deneme Süresi Sona Erdi" : "❌ Erişim Engellendi"}
                    </h2>
                    <p className={styles.accessMessage}>
                        {trialExpired
                            ? "Deneme süreniz doldu. Lütfen bir plan seçmek için profil sayfanıza gidin."
                            : "Bu sayfaya erişiminiz yok. Aboneliğinizi kontrol etmek için profil sayfanıza gidebilirsiniz."}
                    </p>
                    <button
                        className={styles.profileButton}
                        onClick={() => router.push(`/${locale}/dashboard/profile`)}
                    >
                        👤 Profili Görüntüle
                    </button>
                </div>
            </div>
        );
    }

    // ✅ Erişim varsa asıl içerik
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
                    <div key={category.id} style={{ backgroundColor: "transparent" }}>
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
                                    <p><strong>Kullanım Alanı:</strong> {medication.description}</p>
                                    <p><strong>Yan Etkiler:</strong> {medication.sideEffects}</p>
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