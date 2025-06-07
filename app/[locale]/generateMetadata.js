import { getMessages } from "next-intl/server";

export async function generateMetadata({ params }) {
    const locale = params?.locale || "en"; // Varsayılan dil atanır
    const messages = await getMessages({ locale });

    const title = messages.NavbarLinks?.homeTitle || "Default Title";

    return {
        title,
    };
}