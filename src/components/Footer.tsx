"use client";

import { usePortfolio } from "./PortfolioProvider";

export default function Footer() {
  const { profile } = usePortfolio();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>
          {"<PORTFOLIO />"} · {(profile.nameEn || profile.name).toUpperCase()} · 2026
        </p>
      </div>
    </footer>
  );
}
