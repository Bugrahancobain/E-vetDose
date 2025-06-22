// app/dashboard/profile/page.js
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from "../../../../firebase";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";

export default function ProfileSettings() {
    const user = auth.currentUser;
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const uid = user?.uid;

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
            router.push("/login");
        } catch (err) {
            alert("Çıkış yapılırken hata oluştu.");
        }
    };

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
                        <h3>Abonelik Paketleri</h3>
                        <p>Henüz entegre edilmedi.</p>
                        <button onClick={() => setModalOpen(false)} className={styles.button}>
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