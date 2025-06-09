"use client";
import React, { use } from "react";
import HomeFirstComponent from "./components/homeFirstComponent";
import HomeSecondComponent from "./components/homeSecondComponent";
import HomeThirdComponent from "./components/homeThirdComponent";
import HomeBlog from "./components/homeBlog";
import HomeReady from "./components/homeReady";
export default function Home({ params }) {
  const { locale } = use(params);
  return (
    <div>
      <HomeFirstComponent locale={locale} />
      <HomeSecondComponent locale={locale} />
      <HomeThirdComponent locale={locale} />
      <HomeBlog locale={locale} />
      <HomeReady locale={locale} />
    </div>
  );
}