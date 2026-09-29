import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PortfolioProvider from "@/components/PortfolioProvider";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: {
    default: `${profile.name} | ${profile.role} 포트폴리오`,
    template: `%s | ${profile.name}`,
  },
  description: profile.description,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: `${profile.name} | ${profile.role} 포트폴리오`,
    description: profile.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Noto+Serif+KR:wght@200;300;400;500&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          본문으로 건너뛰기
        </a>
        <PortfolioProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </PortfolioProvider>
      </body>
    </html>
  );
}
