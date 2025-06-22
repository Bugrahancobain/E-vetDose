"use client";
import React, { useState } from "react";
import "./MlCalculator.css";
import { useUserAccess } from "../../../../app/hooks/useUserAccess";


export default function MlCalculator() {
    const { hasAccess, trialExpired } = useUserAccess("basic");

    const [mode, setMode] = useState("mgml");

    // mg/ml mode
    const [desiredMg, setDesiredMg] = useState("");
    const [totalMg, setTotalMg] = useState("");
    const [totalMl, setTotalMl] = useState("");

    // unit mode
    const [desiredUnit, setDesiredUnit] = useState("");
    const [unitTotal, setUnitTotal] = useState("");
    const [unitMl, setUnitMl] = useState("");

    const [calculated, setCalculated] = useState(null);

    const handleCalculate = () => {
        if (mode === "mgml") {
            const desired = parseFloat(desiredMg);
            const mg = parseFloat(totalMg);
            const ml = parseFloat(totalMl);

            if (isNaN(desired) || isNaN(mg) || isNaN(ml) || mg <= 0 || ml <= 0) {
                setCalculated("Tüm alanları doldurunuz.");
                return;
            }

            const result = (desired / mg) * ml;
            setCalculated(`Gerekli miktar: ${result.toFixed(2)} ml`);
        } else {
            const desiredU = parseFloat(desiredUnit);
            const unit = parseFloat(unitTotal);
            const ml = parseFloat(unitMl);

            if (isNaN(desiredU) || isNaN(unit) || isNaN(ml) || unit <= 0 || ml <= 0) {
                setCalculated("Tüm alanları doldurunuz.");
                return;
            }

            const result = (desiredU / unit) * ml;
            setCalculated(`Gerekli miktar: ${result.toFixed(2)} ml`);
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
        <div className="calc-container">
            <h2>💉 CC Hesaplama Aracı</h2>

            <div className="switch-wrapper">
                <span className={`switch-label ${mode === "mgml" ? "active" : ""}`}>mg/ml</span>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={mode === "unit"}
                        onChange={() => setMode(mode === "mgml" ? "unit" : "mgml")}
                    />
                    <span className="slider"></span>
                </label>
                <span className={`switch-label ${mode === "unit" ? "active" : ""}`}>Unit</span>
            </div>

            {mode === "mgml" ? (
                <>
                    <label>Uygulanacak Etken Madde (mg)</label>
                    <input
                        type="number"
                        value={desiredMg}
                        onChange={(e) => setDesiredMg(e.target.value)}
                        placeholder="Örn: 15"
                    />

                    <label>Şişedeki Toplam Mg</label>
                    <input
                        type="number"
                        value={totalMg}
                        onChange={(e) => setTotalMg(e.target.value)}
                        placeholder="Örn: 10"
                    />

                    <label>Şişedeki Toplam mL</label>
                    <input
                        type="number"
                        value={totalMl}
                        onChange={(e) => setTotalMl(e.target.value)}
                        placeholder="Örn: 100"
                    />
                </>
            ) : (
                <>
                    <label>Uygulanacak Unit (IU)</label>
                    <input
                        type="number"
                        value={desiredUnit}
                        onChange={(e) => setDesiredUnit(e.target.value)}
                        placeholder="Örn: 15"
                    />

                    <label>Şişedeki Toplam Unit</label>
                    <input
                        type="number"
                        value={unitTotal}
                        onChange={(e) => setUnitTotal(e.target.value)}
                        placeholder="Örn: 10"
                    />

                    <label>Şişedeki Toplam mL</label>
                    <input
                        type="number"
                        value={unitMl}
                        onChange={(e) => setUnitMl(e.target.value)}
                        placeholder="Örn: 100"
                    />
                </>
            )}

            <button className="calculate-btn" onClick={handleCalculate}>
                Hesapla
            </button>

            {calculated && <div className="result">{calculated}</div>}
        </div>
    );
}