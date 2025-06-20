"use client";

import { useState, useEffect } from "react";
import styles from "./alarm.module.css";
import { saveAlarm, fetchAlarms, deleteAlarm } from "../../../../api";
import { auth } from "../../../../firebase";

export default function AlarmPage() {
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