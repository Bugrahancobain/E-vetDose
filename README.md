Next.js Project with next-intl for Internationalization

This is a Next.js project configured with next-intl to support multi-language functionality, including dynamic routing, currency formatting, and date localization.

Features

	•	🌐 Multi-language support (en, tr).
	•	🔄 Dynamic routing for locale-based pages (e.g., /en/about, /tr/about).
	•	💰 Currency formatting based on locale (e.g., €, $, ₺).
	•	📅 Date and number formatting with Intl.NumberFormat.

Directory Structure

Here’s the structure of the project:


Annotated Directory Structure
```
.
├── app                     # Main application folder
│   ├── [locale]            # Locale-based dynamic routing
│   │   ├── aboutUs         # About Us page folder
│   │   │   └── page.js     # About Us page component
│   │   ├── generateMetadata.js # Metadata generation for SEO
│   │   ├── layout.js       # Shared layout for [locale]
│   │   └── page.js         # Home page component
│   ├── globals.css         # Global styles
│   └── page.module.css     # Page-specific styles
├── components              # Reusable UI components
│   └── Navbar.js           # Navbar component
├── messages                # Translation JSON files
│   ├── en.json             # English translations
│   └── tr.json             # Turkish translations
├── src                     # Additional utilities and middleware
│   ├── i18n.js             # Internationalization setup
│   ├── middleware.js       # Middleware for locale handling
├── next.config.mjs         # Next.js configuration
└── README.md               # Documentation
```
Step-by-Step Setup

1️⃣ Install Dependencies

Run the following command to install the required packages:

npm install next next-intl react react-dom

2️⃣ Configure Next.js for i18n

Update next.config.mjs to define supported locales and a default locale:

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en", "tr"], // Supported languages
    defaultLocale: "en",   // Default language
  },
};

export default nextConfig;

3️⃣ Add Middleware

Middleware ensures proper routing for different locales.

Create a file called src/middleware.js:

import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "tr"], // Supported locales
  defaultLocale: "en",   // Default locale
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"], // Match all routes except API and static files
};

4️⃣ Add Translation Files

Add JSON files for each locale in the messages folder:

messages/en.json

{
  "NavbarLinks": {
    "home": "Home",
    "about": "About",
    "profile": "Profile"
  },
  "HomePage": {
    "title": "Welcome to the Home Page!"
  }
}

messages/tr.json

{
  "NavbarLinks": {
    "home": "Ana Sayfa",
    "about": "Hakkında",
    "profile": "Profil"
  },
  "HomePage": {
    "title": "Ana Sayfaya Hoş Geldiniz!"
  }
}

5️⃣ Create a Navbar Component

The navigation bar supports dynamic locale switching:

components/Navbar.js:

"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Navbar({ locale }) {
  const t = useTranslations("NavbarLinks");

  return (
    <nav>
      <Link href={`/${locale}/`}>{t("home")}</Link>
      <Link href={`/${locale}/about`}>{t("about")}</Link>
      <Link href={`/${locale}/profile`}>{t("profile")}</Link>
    </nav>
  );
}

6️⃣ Add Pages

Home Page

app/[locale]/page.js:

"use client";

import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div>
      <h1>{t("title")}</h1>
    </div>
  );
}

About Us Page

app/[locale]/aboutUs/page.js:

"use client";

import { useTranslations } from "next-intl";

export default function AboutUs() {
  const t = useTranslations("AboutPage");

  return (
    <div>
      <h1>{t("title")}</h1>
    </div>
  );
}

Add the following translation to messages/en.json and messages/tr.json:

en.json:

{
  "AboutPage": {
    "title": "About Us"
  }
}

tr.json:

{
  "AboutPage": {
    "title": "Hakkımızda"
  }
}

7️⃣ Run the Project

	•	Start the development server:

npm run dev


	•	Open http://localhost:3000 to view the project.

How It Works

Feature	Description
Dynamic Routing	/en, /tr, or any locale dynamically routes users to the correct language.
Currency Formatting	You can format prices dynamically based on the locale using Intl.NumberFormat.
Translation Support	Messages for UI components are fetched from locale-specific JSON files.

Future Improvements

	•	Add more locales (e.g., es, fr).
	•	Implement currency and date formatting directly in components.
	•	Add unit tests for translation files and locale functionality.

Conclusion

This project demonstrates a scalable Next.js internationalization setup using next-intl. It supports multiple languages, dynamic routing, and locale-based formatting for a globalized user experience.
