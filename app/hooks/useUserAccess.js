import { useUser } from "../../context/UserContext"; // veya senin user state’ine göre

// Planların sıralı erişim seviyesi
const planRank = {
    basic: 1,
    pro: 2,
    enterprise: 3
};

function checkPlanRank(plan) {
    return planRank[plan] || 0;
}

export function useUserAccess(requiredPlan) {
    const user = useUser(); // senin context veya auth sistemine göre
    const now = new Date();

    const isTrial = user?.subscription?.status === "trial" &&
        new Date(user.subscription.trialEnd) > now;

    const isPaid = user?.subscription?.status === "active" &&
        checkPlanRank(user.subscription.plan) >= checkPlanRank(requiredPlan);
    console.log("🔥 User subscription info:", user?.subscription);
    return {
        hasAccess: isTrial || isPaid,
        trialExpired: !isTrial && user?.subscription?.status === "trial"
    };
}