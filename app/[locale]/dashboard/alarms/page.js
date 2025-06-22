"use client";

import { useState, useEffect } from "react";
import styles from "./alarm.module.css";
import { saveAlarm, fetchAlarms, deleteAlarm } from "../../../../api";
import { auth } from "../../../../firebase";
import { useRouter } from "next/navigation"; // en üstte olmalı
import { useUserAccess } from "../../../../app/hooks/useUserAccess";

export default function AlarmPage() {
    const { hasAccess, trialExpired } = useUserAccess("basic");
    const [patientName, setPatientName] = useState("");
    const [description, setDescription] = useState("");
    const [time, setTime] = useState("");
    const [isDaily, setIsDaily] = useState(false);
    const [alarms, setAlarms] = useState([]);
    const user = auth.currentUser;
    const userId = user ? user.uid : "guest";



    const loadAlarms = async () => {
        const data = await fetchAlarms(user.uid);
        setAlarms(data.alarms || []);
    };

    const handleAddAlarm = async () => {
        if (!patientName || !description || !time) {
            alert("Lütfen tüm alanları doldurun.");
            return;
        }

        const alarmData = {
            patientName,
            description,
            time,
            isDaily,
        };

        await saveAlarm(userId, alarmData);
        setPatientName("");
        setDescription("");
        setTime("");
        setIsDaily(false);
        loadAlarms();
    };



    useEffect(() => {
        if (user) {
            loadAlarms();
        }
    }, [user]);

    const handleDelete = async (alarmId) => {
        await deleteAlarm(user.uid, alarmId);
        loadAlarms();
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
            <h1 className={styles.title}>🔔 Yeni Alarm Kur</h1>

            <input
                type="text"
                placeholder="Hasta Adı"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className={styles.input}
            />

            <input
                type="text"
                placeholder="Açıklama"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.input}
            />

            <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={styles.input}
            />

            <div className={styles.switchContainer}>
                <span>🔂 Tek Seferlik</span>
                <label className={styles.switch}>
                    <input
                        type="checkbox"
                        checked={isDaily}
                        onChange={() => setIsDaily(!isDaily)}
                    />
                    <span className={styles.slider}></span>
                </label>
                <span>🔁 Günlük</span>
            </div>

            <button className={styles.addButton} onClick={handleAddAlarm}>
                Alarm Kur
            </button>

            <h2 className={styles.listTitle}>Mevcut Alarmlar</h2>

            <ul className={styles.alarmList}>
                {alarms.map((alarm, index) => (
                    <li key={index} className={styles.alarmItem}>
                        <span>
                            {alarm.patientName} - {alarm.description} ({alarm.time})
                        </span>
                        <button
                            className={styles.deleteButton}
                            onClick={() => handleDelete(alarm._id)}
                        >
                            Sil
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}