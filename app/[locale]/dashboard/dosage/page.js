// 📄 pages/dashboard/dosage.tsx
"use client";

import React, { useState, useEffect } from 'react';
import medicinesData from '../../../../data/medicines.json';
import { useUserAccess } from "../../../../app/hooks/useUserAccess";
import styles from './DoseCalculator.module.css';
import { auth } from '../../../../firebase';
import { useRouter } from "next/navigation"; // en üstte olmalı
import { useParams } from "next/navigation"; // varsa tekrar import etme

export default function DoseCalculator() {
    const { hasAccess, trialExpired } = useUserAccess("basic");
    const [medications, setMedications] = useState([]);
    const [filteredMedications, setFilteredMedications] = useState([]);
    const [selectedMedication, setSelectedMedication] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAnimal, setSelectedAnimal] = useState('');
    const [selectedOrgan, setSelectedOrgan] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('');
    const [dose, setDose] = useState('');
    const [weight, setWeight] = useState('');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [selectedConcentration, setSelectedConcentration] = useState('');
    const [concentrationOptions, setConcentrationOptions] = useState([]);
    const params = useParams();
    const locale = params?.locale || 'en';


    useEffect(() => {
        setMedications(medicinesData);
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = medications.filter((med) =>
                med.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredMedications(filtered);
        } else {
            setFilteredMedications([]);
        }
    }, [searchTerm, medications]);

    const handleCalculate = async () => {
        if (!selectedMedication || !selectedAnimal || !selectedOrgan || !selectedMethod || !dose || !weight) {
            setError('Lütfen tüm alanları doldurun.');
            return;
        }

        const doseData = selectedMedication?.dose?.[selectedAnimal]?.[selectedOrgan]?.[selectedMethod];
        if (!doseData) {
            setError('Seçilen bilgilerle doz bulunamadı.');
            return;
        }

        const numericDose = parseFloat(dose);
        const numericWeight = parseFloat(weight);
        if (isNaN(numericDose) || isNaN(numericWeight)) {
            setError('Geçerli bir doz ve kilo girin.');
            return;
        }

        let calculatedDose;
        if (doseData.doseType === 'dosePerKgRange') {
            if (numericDose < doseData.doseValue[0] || numericDose > doseData.doseValue[1]) {
                setError(`Doz aralığı ${doseData.doseValue[0]} - ${doseData.doseValue[1]} olmalı.`);
                return;
            }
            calculatedDose = numericDose * numericWeight;
        } else if (doseData.doseType === 'dosePerKg') {
            if (numericDose !== doseData.doseValue) {
                setError(`Doz ${doseData.doseValue} olmalı.`);
                return;
            }
            calculatedDose = doseData.doseValue * numericWeight;
        } else if (doseData.doseType === 'fixedDose') {
            if (numericDose !== doseData.doseValue) {
                setError(`Doz ${doseData.doseValue} olmalı.`);
                return;
            }
            calculatedDose = doseData.doseValue;
        } else {
            setError('Doz bilgisi geçersiz.');
            return;
        }

        let requiredCc = null;
        if (selectedConcentration && selectedMedication.concentrations[selectedConcentration]) {
            const { medicineMl, medicineMg } = selectedMedication.concentrations[selectedConcentration];
            if (medicineMg > 0) {
                const concentrationRatio = medicineMl / medicineMg;
                requiredCc = (calculatedDose * concentrationRatio).toFixed(2);
            }
        }

        setResult(`${calculatedDose} ${doseData.unit || 'mg'}${requiredCc ? ` | Gerekli Miktar: ${requiredCc} cc` : ''}`);
        setError('');

        const user = auth.currentUser;
        const uid = user?.uid;

        if (!uid) {
            console.error("Kullanıcı oturumu yok");
            return;
        }

        // MongoDB'ye gönder
        const res = await fetch('/api/save-dosage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid,
                medication: selectedMedication.name,
                animal: selectedAnimal,
                organ: selectedOrgan,
                method: selectedMethod,
                dose: numericDose,
                weight: numericWeight,
                calculatedDose,
                concentration: selectedConcentration,
                requiredCc,
                date: new Date().toISOString(),
            }),
        });

        if (!res.ok) {
            console.error('💥 MongoDB kaydı başarısız.');
        }
    };
    const getPlaceholder = () => {
        const doseData = selectedMedication?.dose?.[selectedAnimal]?.[selectedOrgan]?.[selectedMethod];

        if (!doseData) return 'Gerekli Doz';

        switch (doseData.doseType) {
            case 'dosePerKgRange':
                return `Gerekli Doz: ${doseData.doseValue[0]} - ${doseData.doseValue[1]}`;
            case 'dosePerKg':
            case 'fixedDose':
                return `Gerekli Doz: ${doseData.doseValue}`;
            case 'dosePerUnit':
                return `Gerekli Doz: ${doseData.doseValue[0]} - ${doseData.doseValue[1]}`;
            default:
                return 'Gerekli Doz';
        }
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
        <div className={styles.container}>
            <h1 className={styles.title}>Doz Hesaplama</h1>
            <input
                className={styles.input}
                placeholder="İlaç Ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredMedications.map((item) => (
                <div key={item.id} className={styles.item} onClick={() => {
                    setSelectedMedication(item);
                    setSelectedAnimal('');
                    setSearchTerm(item.name);
                    setFilteredMedications([]);
                    setResult('');
                }}>{item.name}</div>
            ))}

            {selectedMedication && (
                <div className={styles.box}>
                    <label className={styles.label}>Hayvan Türü:</label>
                    <select className={styles.select} value={selectedAnimal} onChange={(e) => setSelectedAnimal(e.target.value)}>
                        <option value="">Seçiniz</option>
                        {Object.keys(selectedMedication.dose).map((animal) => (
                            <option key={animal} value={animal}>{animal}</option>
                        ))}
                    </select>

                    {selectedAnimal && (
                        <>
                            <label className={styles.label}>Tedavi Bölgesi:</label>
                            <select className={styles.select} value={selectedOrgan} onChange={(e) => setSelectedOrgan(e.target.value)}>
                                <option value="">Seçiniz</option>
                                {Object.keys(selectedMedication.dose[selectedAnimal]).map((organ) => (
                                    <option key={organ} value={organ}>{organ}</option>
                                ))}
                            </select>
                        </>
                    )}

                    {selectedOrgan && (
                        <>
                            <label className={styles.label}>Uygulama Yöntemi:</label>
                            <select className={styles.select} style={{ backgroundColor: "white", color: "black" }} value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)}>
                                <option value="">Seçiniz</option>
                                {Object.keys(selectedMedication.dose[selectedAnimal][selectedOrgan]).map((method) => (
                                    <option key={method} value={method}>{method}</option>
                                ))}
                            </select>
                        </>
                    )}

                    {selectedMethod && (
                        <>
                            <input
                                className={styles.input}
                                placeholder={dose === '' ? getPlaceholder() : ''}
                                value={dose}
                                onChange={(e) => setDose(e.target.value)}
                            />
                            <input
                                className={styles.input}
                                placeholder="Kilo"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                            />
                            {selectedMedication.concentrations && (
                                <select className={styles.select} value={selectedConcentration} onChange={(e) => setSelectedConcentration(e.target.value)}>
                                    <option value="">Konsantrasyon Seçiniz</option>
                                    {Object.keys(selectedMedication.concentrations).map((key) => (
                                        <option key={key} value={key}>{key}</option>
                                    ))}
                                </select>
                            )}
                            <button className={styles.button} onClick={handleCalculate}>Hesapla</button>
                            {error && <p className={styles.error}>{error}</p>}
                            {result && <p className={styles.result}>{result}</p>}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}