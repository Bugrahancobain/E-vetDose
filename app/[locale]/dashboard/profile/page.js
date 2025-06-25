// app/dashboard/profile/page.js
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from "../../../../firebase";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";
import { useParams } from "next/navigation"; // varsa tekrar import etme
import { useUserAccess } from "../../../../app/hooks/useUserAccess";



export default function ProfileSettings() {
    const user = auth.currentUser;
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale || 'en';
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [billingCycle, setBillingCycle] = useState("monthly");

    const [selectedPlan, setSelectedPlan] = useState("556653"); // default: basic monthly
    const [subscriptionInfo, setSubscriptionInfo] = useState(null);
    const { isLoading } = useUserAccess("trial", "basic", "pro", "enterprise");



    const plans = {
        monthly: [
            { id: "556653", name: "Basic", price: "$35.99/ay" },
            { id: "556664", name: "Pro", price: "$59.99/ay" },
            // { id: "556665", name: "Enterprise", price: "$119.99/ay" },
        ],
        yearly: [
            { id: "556667", name: "Basic", price: "$359.99/yıl ($29.99/ay)" },
            { id: "556668", name: "Pro", price: "$599.99/yıl ($49.99/ay)" },
            // { id: "556669", name: "Enterprise", price: "$1199.99/yıl ($99.99/ay)" },
        ]
    };

    const getLemonLinkById = (id) => {
        const links = {
            "556653": "https://e-vetdose.lemonsqueezy.com/buy/9b3b3d8b-0756-44ed-8ba1-03e251158960",
            "556667": "https://e-vetdose.lemonsqueezy.com/buy/c7fd6280-9f21-4574-b14e-c9c5ab73db09",
            "556664": "https://e-vetdose.lemonsqueezy.com/buy/9b43a1d4-dbdc-4cab-9ece-ff91f7cc3291",
            "556668": "https://e-vetdose.lemonsqueezy.com/buy/b09f2c4c-9e04-4343-b9aa-96adcbc0cbd2",
            "556665": "https://e-vetdose.lemonsqueezy.com/buy/939d9a1c-d992-4805-91ba-50cac299f99a",
            "556669": "https://e-vetdose.lemonsqueezy.com/buy/001ccc32-5910-4a00-bd4e-1d74bdec2e3c",
        };
        return links[id];
    };

    const uid = user?.uid;
    useEffect(() => {
        if (!uid) return;
        fetch(`/api/register?uid=${uid}`)
            .then(res => res.json())
            .then(data => {
                setName(data.fullName);
                setEmail(data.email);
                setProfileImage(data.profileImage || "/defaultDogImage.png");
                setSubscriptionInfo(data.subscription || null);
            });
    }, [uid]);
    useEffect(() => {
        if (!uid) return;
        fetch(`/api/register?uid=${uid}`)
            .then((res) => res.json())
            .then((data) => {
                setName(data.fullName);
                setEmail(data.email);
                setProfileImage(data.profileImage || "/defaultDogImage.png");
            });
    }, [uid]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImage(reader.result); // base64 string
        };
        if (file) reader.readAsDataURL(file);

    };

    const handleSave = async () => {
        console.log("📤 Gönderilecek profileImage:", profileImage); // <== BURAYA KOY
        setLoading(true);
        try {
            const res = await fetch("/api/register", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid, fullName: name, profileImage }), // burada null gidiyor olabilir
            });
            const data = await res.json();
            alert(data.message);
        } catch (err) {
            alert("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            alert("Şifre sıfırlama e-postası gönderildi.");
        } catch (err) {
            alert("Şifre sıfırlanamadı.");
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            router.push(`/${locale}/login`, { scroll: false });
        } catch (err) {
            alert("Çıkış yapılırken hata oluştu.");
        }
    };

    if (isLoading || !user) {
        return (
            <div className={styles.loadingWrapper}>
                <div className={styles.spinner}></div>
                <p className={styles.loadingText}>Veriler yükleniyor, lütfen bekleyin...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Profil Ayarları</h2>

            <div className={styles.imageWrapper}>
                <Image
                    src={profileImage || "/defaultDogImage.png"}
                    alt="Profil Fotoğrafı"
                    width={120}
                    height={120}
                    className={styles.profileImage}
                />
                <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>

            <input
                className={styles.input}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="İsim Soyisim"
            />

            <button
                onClick={handleSave}
                className={styles.button}
                disabled={loading}
            >
                {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>

            <button onClick={handleResetPassword} className={styles.secondaryButton}>
                Şifreyi Sıfırla
            </button>

            <button onClick={() => setModalOpen(true)} className={styles.secondaryButton}>
                📜 Aboneliğini Yönet
            </button>

            {modalOpen && (
                <div className={styles.modalOverlay}>

                    <div className={styles.modalContent}>
                        {subscriptionInfo?.plan ? (
                            <div className={styles.subscriptionBox}>
                                <p>📦 Paket: <strong>{subscriptionInfo.plan}</strong> ({subscriptionInfo.billingCycle})</p>
                                <p>⏳ Bitiş Tarihi: {new Date(subscriptionInfo.subscriptionEnd).toLocaleDateString()}</p>

                                <button
                                    className={styles.dangerButton}
                                    onClick={async () => {
                                        const res = await fetch("/api/subscription/cancel", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ email })
                                        });
                                        const data = await res.json();
                                        alert(data.message || "İptal edildi.");
                                    }}
                                >
                                    Aboneliği İptal Et
                                </button>
                            </div>
                        ) : subscriptionInfo?.trialEnd ? (
                            <div className={styles.subscriptionBox}>
                                <p>🆓 Şu anda ücretsiz deneme süresindesiniz.</p>
                                <p>⏳ Deneme Bitiş: {new Date(subscriptionInfo.trialEnd).toLocaleDateString()}</p>
                            </div>
                        ) : (
                            <div className={styles.subscriptionBox}>
                                <p>🕓 Henüz aktif bir aboneliğiniz bulunmamaktadır.</p>
                            </div>
                        )}
                        <h3>Abonelik Paketleri</h3>

                        <div className={styles.toggleContainer}>
                            <span
                                className={`${styles.toggleLabel} ${billingCycle === "monthly" ? styles.active : ""}`}
                                onClick={() => setBillingCycle("monthly")}
                            >
                                Aylık
                            </span>

                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={billingCycle === "yearly"}
                                    onChange={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                                />
                                <span className={styles.slider}></span>
                            </label>

                            <span
                                className={`${styles.toggleLabel} ${billingCycle === "yearly" ? styles.active : ""}`}
                                onClick={() => setBillingCycle("yearly")}
                            >
                                Yıllık
                            </span>
                        </div>

                        <select
                            value={selectedPlan}
                            onChange={(e) => setSelectedPlan(e.target.value)}
                            className={styles.select}
                        >
                            {plans[billingCycle].map((plan) => (
                                <option key={plan.id} value={plan.id}>
                                    {plan.name} - {plan.price}
                                </option>
                            ))}
                        </select>

                        <button
                            className={styles.button}
                            onClick={() => window.open(getLemonLinkById(selectedPlan), "_blank")}
                        >
                            Satın Al
                        </button>

                        <button onClick={() => setModalOpen(false)} className={styles.secondaryButton}>
                            Kapat
                        </button>
                    </div>
                </div>
            )}

            <button onClick={handleLogout} className={styles.logoutButton}>
                Çıkış Yap
            </button>
        </div>
    );
}