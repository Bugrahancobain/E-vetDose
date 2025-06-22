import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase"; // doğru yolu ver
import { onAuthStateChanged } from "firebase/auth";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const uid = firebaseUser.uid;
                try {
                    const res = await fetch(`/api/register?uid=${uid}`);
                    const data = await res.json();
                    setUser(data);
                } catch (err) {
                    console.error("Kullanıcı verisi alınamadı:", err);
                }
            } else {
                setUser(null); // çıkış yapıldıysa
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext).user;
}