// src/app/[locale]/aboutUs/page.js veya page.tsx
"use client";

import { useTranslations } from "next-intl";
import "./aboutUs.css"; // CSS burada ayrı dosyada tanımlanacak

export default function AboutUsPage() {
    const t = useTranslations("aboutUs");

    return (
        <div className="aboutUsMain">
            {/* Banner */}
            <div className="aboutUsBanner">
                <h1>{t("title")}</h1>
            </div>

            {/* İçerik */}
            <div className="aboutUsContent">
                <p>{t("intro")}</p>

                <h2>{t("aiTitle")}</h2>
                <p>{t("aiDesc")}</p>

                <h2>{t("anamnezTitle")}</h2>
                <p>{t("anamnezDesc")}</p>

                <h2>{t("drugSearchTitle")}</h2>
                <p>{t("drugSearchDesc")}</p>

                <h2>{t("libraryTitle")}</h2>
                <p>{t("libraryDesc")}</p>

                <h2>{t("dosageTitle")}</h2>
                <p>{t("dosageDesc")}</p>

                <h2>{t("reminderTitle")}</h2>
                <p>{t("reminderDesc")}</p>

                <p>{t("conclusion")}</p>
            </div>
        </div>
    );
}