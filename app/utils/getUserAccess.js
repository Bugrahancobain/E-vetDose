import { getDoc, doc } from "firebase/firestore";
import { auth } from "../../firebase";

export async function getUserAccess(uid, requiredPlan = "basic") {
    const userDoc = await getDoc(doc(auth, "users", uid));
    const userData = userDoc.exists() ? userDoc.data() : null;

    const currentPlan = userData?.plan || "free";
    const trialExpired = userData?.trialExpired || false;

    const hasAccess =
        currentPlan === "premium" || currentPlan === requiredPlan;

    return { hasAccess, trialExpired };
}