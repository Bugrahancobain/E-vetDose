'use client';
import { useEffect, useRef, useState } from "react";
import styles from "./ai-assistant.module.css";
import { sendMessageToChatGPT, uploadImageToGridFS, fetchMessageHistory, saveMessage } from "../../../../api.js";
import { v4 as uuidv4 } from "uuid";
import { auth } from "../../../../firebase";
import { useRouter, useParams } from "next/navigation";
import { useUserAccess } from "../../../../app/hooks/useUserAccess";

export default function AIAssistant() {
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale || "en";
    const { hasAccess, trialExpired } = useUserAccess("pro");

    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const [lastSentTime, setLastSentTime] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const flatListRef = useRef(null);
    const scrollToBottom = () => {
        if (flatListRef.current) {
            flatListRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };
    // Kullanıcıyı kontrol et
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
            setUser(u);
        });
        return () => unsubscribe();
    }, []);

    // Mesaj geçmişini getir
    useEffect(() => {
        const loadMessages = async () => {
            if (!user) return;

            try {
                const data = await fetchMessageHistory(user.uid);
                const sorted = data.sort((a, b) => a.timestamp - b.timestamp);
                if (sorted.length === 0) {
                    const welcomeMessage = {
                        _id: uuidv4(),
                        text: "Merhabalar Veteriner Hekim, bugün size nasıl yardımcı olabilirim?",
                        sender: "bot",
                        timestamp: Date.now(),
                    };
                    await saveMessage(user.uid, welcomeMessage);
                    setMessages([welcomeMessage]);
                } else {
                    setMessages(sorted);
                }
            } catch (err) {
                console.error("Mesajlar alınamadı:", err);
                setMessages([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadMessages();
    }, [user]);

    // Geri sayım süresi
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

    // Scroll to bottom
    useEffect(() => {
        flatListRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleImageUpload = async (file) => {
        const uploaded = await uploadImageToGridFS(file, user.uid);
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

        await saveMessage(user.uid, newUserMessage);

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
                    saveMessage(user.uid, finalBotMessage);
                    setIsTyping(false);
                }
            }, 20);
        } catch (err) {
            console.error("AI cevabı alınamadı:", err);
            setIsTyping(false);
        }
    };

    return (
        <div className={styles.container}>
            {isLoading || !user ? (
                <div className={styles.loadingWrapper}>
                    <div className={styles.spinner}></div>
                    <p className={styles.loadingText}>Veriler yükleniyor, lütfen bekleyin...</p>
                </div>
            ) : !hasAccess ? (
                <div className={styles.accessWrapper}>
                    <h2>
                        {trialExpired ? "🚫 Deneme Süresi Sona Erdi" : "❌ Erişim Engellendi"}
                    </h2>
                    <p>
                        {trialExpired
                            ? "Deneme süreniz doldu. Lütfen bir plan seçmek için profil sayfanıza gidin."
                            : "Bu sayfaya erişiminiz yok. Aboneliğinizi kontrol etmek için profil sayfanıza gidebilirsiniz."}
                    </p>
                    <button onClick={() => router.push(`/${locale}/dashboard/profile`)}>
                        👤 Profili Görüntüle
                    </button>
                </div>
            ) : (
                <>
                    <div className={styles.chatBox}>
                        {messages.map((msg) => (
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
                                <img src={URL.createObjectURL(selectedImage)} alt="Önizleme" className={styles.previewImage} />
                                <button onClick={() => setSelectedImage(null)} className={styles.removePreview}>X</button>
                            </div>
                        </div>
                    )}

                    <div className={styles.inputArea}>
                        <label htmlFor="file-upload" className={styles.customFileButton}>+</label>
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
                </>
            )}
        </div>
    );
}