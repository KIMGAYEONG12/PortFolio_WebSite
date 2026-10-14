"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar from "./Avatar";
import { usePortfolio } from "./PortfolioProvider";
import ResumeModal from "./ResumeModal";

export default function Header() {
  const { profile, ready, canEdit } = usePortfolio();
  const pathname = usePathname();
  const onMy = pathname === "/my";
  const [resumeOpen, setResumeOpen] = useState(false);

  const avatar = (
    <span className="fade-swap" data-pending={!ready || undefined}>
      <Avatar photo={profile.photo} name={profile.name} size={40} x={profile.photoX} y={profile.photoY} zoom={profile.photoZoom} />
    </span>
  );

  return (
    <>
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="wordmark">
          <span className="fade-swap" data-pending={!ready || undefined}>
            {profile.name}의 포트폴리오
          </span>
        </Link>
        <nav aria-label="주요 메뉴">
          <ul className="nav-list">
            <li>
              <button type="button" className="nav-link nav-link-btn" onClick={() => setResumeOpen(true)}>
                이력서 보기
              </button>
            </li>
            {profile.navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nav-link">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <button type="button" className="nav-link nav-link-btn" onClick={() => setResumeOpen(true)}>
                이력서 보기
              </button>
            </li>
            <li>
              {canEdit ? (
                <Link
                  href="/my"
                  className={`nav-my ${onMy ? "is-active" : ""}`.trim()}
                  aria-current={onMy ? "page" : undefined}
                >
                  {avatar}
                  <span className="nav-my-label">MY</span>
                </Link>
              ) : (
                <Link href="/" className="nav-photo" aria-label="맨 위로">
                  {avatar}
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
      {/* 헤더의 흐림 효과 안에 넣으면 창 위치가 틀어져서 헤더 밖에 둡니다 */}
      {resumeOpen && <ResumeModal onClose={() => setResumeOpen(false)} />}
    </>
  );
}
