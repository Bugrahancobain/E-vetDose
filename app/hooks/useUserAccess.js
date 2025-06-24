import { useEffect, useState } from "react";
import { auth } from "../../firebase";

// Planların sıralı erişim seviyesi
const planRank = {
    trial: 1,
    basic: 1,
    pro: 2,
    enterprise: 3,
};

export function useUserAccess(requiredPlan = "basic") {
    const [hasAccess, setHasAccess] = useState(false);
    const [trialExpired, setTrialExpired] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // YENİ
    const [user, setUser] = useState(null); // YENİ

    useEffect(() => {
        const checkAccess = async () => {
            const currentUser = auth.currentUser;
            setUser(currentUser); // kullanıcıyı da set et
            if (!currentUser) {
                setIsLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/register?uid=${currentUser.uid}`);
                const data = await res.json();
                const sub = data.subscription || {};

                const now = new Date();
                const isTrialActive = sub.status === "trial" && sub.trialEnd && new Date(sub.trialEnd) > now;
                const isTrialExpired = sub.status === "trial" && (!sub.trialEnd || new Date(sub.trialEnd) <= now);

                let userPlan = "basic"; // varsayılan
                if (isTrialActive) userPlan = "trial";
                else if (sub.plan) userPlan = sub.plan;

                const userRank = planRank[userPlan] || 0;
                const requiredRank = planRank[requiredPlan] || 0;

                setHasAccess(userRank >= requiredRank);
                setTrialExpired(userPlan === "trial" && isTrialExpired);
            } catch (error) {
                console.error("Kullanıcı erişimi kontrol edilirken hata:", error);
                setHasAccess(false);
            } finally {
                setIsLoading(false); // HER DURUMDA yükleme biter
            }
        };

        checkAccess();
    }, [requiredPlan]);

    return { hasAccess, trialExpired, isLoading, user };
}