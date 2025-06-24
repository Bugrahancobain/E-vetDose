"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./ai-assistant.module.css";
import { sendMessageToChatGPT, uploadImageToGridFS, fetchMessageHistory, saveMessage } from "../../../../api.js";
import { v4 as uuidv4 } from "uuid";
import { auth } from "../../../../firebase";
import { useRouter } from "next/navigation"; // en üstte olmalı
import { useUserAccess } from "../../../../app/hooks/useUserAccess";
import { useParams } from "next/navigation"; // varsa tekrar import etme

export default function AIAssistant() {
    const { hasAccess, trialExpired } = useUserAccess("pro");
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const flatListRef = useRef(null);
    const user = auth.currentUser;
    const [lastSentTime, setLastSentTime] = useState(0);
    const userId = user ? user.uid : "guest";
    const params = useParams();
    const locale = params?.locale || 'en';

    useEffect(() => {
        if (remainingTime === 0) return;

        const interval = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [remainingTime]);
    // Mesaj geçmişini çek
    useEffect(() => {
        const loadMessages = async () => {
            try {
                const data = await fetchMessageHistory(userId);
                const sorted = data.sort((a, b) => a.timestamp - b.timestamp);
                if (sorted.length === 0) {
                    const welcomeMessage = {
                        _id: uuidv4(),
                        text: "Merhabalar Veteriner Hekim, bugün size nasıl yardımcı olabilirim?",
                        sender: "bot",
                        timestamp: Date.now(),
                    };
                    await saveMessage(userId, welcomeMessage);
                    setMessages([welcomeMessage]);
                } else {
                    setMessages(sorted);
                }
            } catch (err) {
                console.error("Mesajlar alınamadı:", err);
                setMessages([]);
            }
        };
        loadMessages();
    }, []);

    const scrollToBottom = () => {
        flatListRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    console.log("auth.currentUser", auth.currentUser);
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleImageUpload = async (file) => {
        const uploaded = await uploadImageToGridFS(file, userId);
        return uploaded;
    };

    const handleSendMessage = async () => {
        if (!inputText && !selectedImage) return;

        if (remainingTime > 0) {
            alert("Lütfen 10 saniye bekleyin.");
            return;
        }
        setRemainingTime(10);
        setLastSentTime(Date.now());

        const newUserMessage = {
            _id: uuidv4(),
            text: inputText || "📷 Görsel gönderildi",
            sender: "user",
            timestamp: Date.now(),
            image: selectedImage ? await handleImageUpload(selectedImage) : null,
        };

        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);
        setInputText("");
        setSelectedImage(null);
        setIsTyping(true);
        scrollToBottom();

        await saveMessage(userId, newUserMessage);

        try {
            const gptResponse = await sendMessageToChatGPT(newUserMessage.text);
            let botText = "";
            const typingInterval = setInterval(() => {
                if (botText.length < gptResponse.length) {
                    botText = gptResponse.slice(0, botText.length + 1);
                    setMessages((prev) => [
                        ...updatedMessages,
                        { _id: uuidv4(), text: botText, sender: "bot", timestamp: Date.now(), typing: true },
                    ]);
                } else {
                    clearInterval(typingInterval);
                    const finalBotMessage = {
                        _id: uuidv4(),
                        text: gptResponse,
                        sender: "bot",
                        timestamp: Date.now(),
                    };
                    setMessages((prev) => [...updatedMessages, finalBotMessage]);
                    saveMessage(userId, finalBotMessage);
                    setIsTyping(false);
                }
            }, 20);
        } catch (err) {
            console.error("AI cevabı alınamadı:", err);
            setIsTyping(false); // 🔴 hatada da kilidi kaldır
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
            <div className={styles.chatBox}>
                {Array.isArray(messages) && messages.map((msg) => (
                    <div key={msg._id} className={msg.sender === "user" ? styles.userMsg : styles.botMsg}>
                        {msg.text}
                        {msg.image && <img src={msg.image} className={styles.image} />}
                    </div>
                ))}
                <div ref={flatListRef} />
            </div>
            {selectedImage && (
                <div className={styles.previewWrapper}>
                    <div className={styles.previewContainer}>
                        <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Önizleme"
                            className={styles.previewImage}
                        />
                        <button onClick={() => setSelectedImage(null)} className={styles.removePreview}>
                            X
                        </button>
                    </div>
                </div>
            )}
            <div className={styles.inputArea}>
                <label htmlFor="file-upload" className={styles.customFileButton}>
                    +
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                    className={styles.hiddenFileInput}
                />

                <input
                    type="text"
                    value={inputText}
                    placeholder={
                        isTyping
                            ? "Lütfen AI Hekimin cevabını bekleyin..."
                            : remainingTime > 0
                                ? `Lütfen ${remainingTime} saniye bekleyin...`
                                : "Mesaj yazın..."
                    }
                    onChange={(e) => setInputText(e.target.value)}
                    className={styles.textInput}
                    disabled={isTyping || remainingTime > 0}
                />
                <button
                    onClick={handleSendMessage}
                    className={styles.sendBtn}
                    disabled={isTyping || remainingTime > 0}
                >
                    Gönder
                </button>
            </div>
        </div>
    );
}