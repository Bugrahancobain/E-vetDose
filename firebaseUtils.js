// firebaseUtils.js
import { ref, get, set, remove } from "firebase/database";
import { realtimeDb } from "./firebase";

// Dinamik bir toggleLike fonksiyonu
export const toggleLike = async (type, itemId, deviceId) => {
    try {
        const likeRef = ref(realtimeDb, `${type}/${itemId}/likes/${deviceId}`);
        const snapshot = await get(likeRef);

        if (snapshot.exists()) {
            // Beğeniyi kaldır
            await remove(likeRef);
        } else {
            // Beğeni ekle
            await set(likeRef, true);
        }

        // Toplam beğeni sayısını döndür
        const likesRef = ref(realtimeDb, `${type}/${itemId}/likes`);
        const likesSnapshot = await get(likesRef);
        const likesData = likesSnapshot.val() || {};
        return likesData;
    } catch (error) {
        console.error("Error toggling like:", error);
    }
};

// Beğeni sayısını almak
export const getLikesCount = async (type, itemId) => {
    try {
        const likesRef = ref(realtimeDb, `${type}/${itemId}/likes`);
        const snapshot = await get(likesRef);
        const likesData = snapshot.val() || {};
        return Object.keys(likesData).length; // Toplam beğeni sayısını döndür
    } catch (error) {
        console.error("Error getting likes count:", error);
        return 0;
    }
};

// Kullanıcının beğeni durumunu kontrol et
export const hasLiked = async (type, itemId, deviceId) => {
    try {
        const likeRef = ref(realtimeDb, `${type}/${itemId}/likes/${deviceId}`);
        const snapshot = await get(likeRef);
        return snapshot.exists(); // Cihazın ilgili gönderiyi beğenip beğenmediğini kontrol et
    } catch (error) {
        console.error("Error checking like status:", error);
        return false;
    }
};