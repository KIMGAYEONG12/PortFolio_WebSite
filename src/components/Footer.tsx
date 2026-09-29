"use client";

import { usePortfolio } from "./PortfolioProvider";

export default function Footer() {
  const { profile } = usePortfolio();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>2026-09-29 {profile.name}</p>
        <p>Next.js로 만들었습니다</p>
      </div>
    </footer>
  );
}
