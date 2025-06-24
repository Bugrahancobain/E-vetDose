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

    useEffect(() => {
        const checkAccess = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const res = await fetch(`/api/register?uid=${user.uid}`);
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

            if (userRank >= requiredRank) {
                setHasAccess(true);
            } else {
                setHasAccess(false);
            }

            if (userPlan === "trial" && isTrialExpired) {
                setTrialExpired(true);
            }
        };

        checkAccess();
    }, [requiredPlan]);

    return { hasAccess, trialExpired };
}