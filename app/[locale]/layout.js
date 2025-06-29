import NavbarWrapper from "./components/NavbarWrapper";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import FooterWrapper from "./components/FooterWrapper";
import Head from "next/head";

export const metadata = {
  title: 'E-VetDose',
  description: 'Veterinerler için akıllı asistan',
  manifest: '/manifest.json',
  themeColor: '#254650',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
  },
};

export default async function RootLayout({ children, params }) {
  // params.locale'i await ile çöz
  const locale = params?.locale || "en"; // Varsayılan dil atanır
  const messages = await getMessages({ locale });


  return (
    <html lang={locale}>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#254650" />
      </Head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>

          <NavbarWrapper locale={locale} />
          {children}
          <FooterWrapper locale={locale} />

        </NextIntlClientProvider>
      </body>
    </html>
  );
}