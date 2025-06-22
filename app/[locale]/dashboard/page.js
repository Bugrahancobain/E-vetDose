"use client";
import { registerFCMToken } from "../../../fcm-client.js";
import { auth } from "../../../firebase";
import React, { useEffect, useState } from "react";
import { useLocale } from 'next-intl';
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import "./styles/dashboardHome.css";

const DashboardHome = () => {
    const [uid, setUid] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [dailyTip, setDailyTip] = useState("");
    const [doseHistory, setDoseHistory] = useState([]);
    const [alarms, setAlarms] = useState([]);
    const router = useRouter();
    const locale = useLocale();
    const pathname = usePathname();
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                registerFCMToken(user.uid);
                setUid(user.uid); // ✅ UID burada set ediliyor
            }
        });

        return () => unsubscribe();
    }, []);
    useEffect(() => {
        if (!uid) return;

        // Kullanıcı bilgilerini çek
        fetch(`/api/register?uid=${uid}`)
            .then((res) => res.json())
            .then((data) => {
                setUserInfo({
                    fullName: data.fullName,
                    profileImage: data.profileImage || "/defaultDogImage.png",
                });
            });

        fetch(`/api/alarms?uid=${uid}`)
            .then(res => res.json())
            .then(data => setAlarms(data.alarms || []));


        // Doz geçmişini çek
        fetch(`/api/save-dosage?uid=${uid}`)
            .then((res) => res.json())
            .then((data) => {
                const recent = data?.reverse().slice(0, 10);
                setDoseHistory(recent);
            });
    }, [uid]);

    useEffect(() => {
        fetch("/api/daily-tip")
            .then((res) => res.json())
            .then((data) => {
                console.log("Gelen dailyTip:", data.tip); // ✅ buraya alındı
                setDailyTip(data.tip);
            })
            .catch((err) => console.error("Tip fetch hatası:", err));
    }, []); // sadece bir kere çalışmalı

    return (
        <div className="dashboardHomeContainer">
            {/* Profil Görüntüleme ve Hoşgeldin */}
            <div className="dashboardHomeProfile" onClick={() => router.push(`${pathname}/profile`)}>
                <div className="profileImgWrapper">
                    <Image
                        src={userInfo?.profileImage || "/defaultDogImage.png"}
                        alt="Profil"
                        width={60}
                        height={60}
                        className="profileImg"
                    />
                </div>
                <div className="welcomeText">
                    Hoşgeldin, <strong>{userInfo?.fullName || "Veteriner"}</strong>! Bugün nasıl yardımcı olabilirim?
                </div>
            </div>

            {/* Günlük Bilgi */}
            <div className="dailyTipBox">
                <h3>Günlük Veteriner Bilgisi</h3>
                <p>{dailyTip || "Bugün için bilgi bulunamadı."}</p>
            </div>
            {/* Alarm Listesi */}
            <div className="alarmBox">
                <h3>Aşı / İlaç Alarmları</h3>
                {alarms.length === 0 ? (
                    <p>Henüz bir alarm kurmadınız.</p>
                ) : (
                    <ul className="alarmList">
                        {alarms.slice(0, 4).map((alarm, index) => (
                            <li className="alarmItem" key={index}>
                                <div>
                                    <strong>{alarm.patientName}</strong> - {alarm.description}
                                </div>
                                <div>
                                    ⏰ {alarm.time} {alarm.isDaily ? "(Günlük)" : ""}
                                </div>
                            </li>
                        ))}
                        {alarms.length > 4 && (
                            <button
                                className="seeMoreBtn"
                                onClick={() => router.push(`${pathname}/alarms`)}
                            >
                                Tümünü Gör
                            </button>
                        )}
                    </ul>
                )}
            </div>
            {/* Dozaj Geçmişi */}
            <div className="doseHistoryBox">
                <h3>Son Hesaplanan Dozajlar</h3>
                {doseHistory.length === 0 ? (
                    <p>Henüz bir dozaj hesaplamadınız.</p>
                ) : (
                    <ul className="doseHistoryList">
                        {doseHistory.map((item, index) => (
                            <li className="dosageHistoryWrapperLi" key={index}>
                                <div>
                                    <strong>{item.medication}</strong> | {item.animal} | {item.organ} | {item.method} | {item.concentration} <br />
                                </div>
                                <div>
                                    Dozaj Girdisi: {item.dose} | Kilo: {item.weight} | Gerekli: {item.requiredCc} <br />
                                </div>
                                <div>
                                    <small>{new Date(item.date).toLocaleString('tr-TR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</small>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default DashboardHome;
