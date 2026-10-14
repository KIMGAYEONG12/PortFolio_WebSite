"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { usePortfolio } from "./PortfolioProvider";
import ResumeModal from "./ResumeModal";

/** 제목 아래 한 줄 설명 */
const HERO_SUB = "Figma 와이어프레임을 기준으로 작업을 나누고, 백엔드 API 명세를 함께 확인하며 Next.js로 옮깁니다.";

/** 한 줄 소개를 단어 단위로 나눠 아래에서 차례로 올라오게 합니다. **강조** 부분은 파란 강조색. */
function RisingTagline({ text }: { text: string }) {
  let n = 0;
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) => {
        const words = part.split(/(\s+)/).map((t, j) => {
          if (!t.trim()) return t;
          const idx = n++;
          return (
            <span key={`${i}-${j}`} className="rise-word" aria-hidden="true">
              <span style={{ "--i": idx } as CSSProperties}>{t}</span>
            </span>
          );
        });
        return i % 2 ? (
          <em key={i} className="rise-hl">
            {words}
          </em>
        ) : (
          <span key={i}>{words}</span>
        );
      })}
    </>
  );
}

export default function Hero() {
  const { profile, projects, ready } = usePortfolio();
  const floatRef = useRef<HTMLDivElement>(null);
  const [resumeOpen, setResumeOpen] = useState(false);

  // 히어로 주변의 앱 화면들이 마우스를 따라 살짝 움직입니다
  useEffect(() => {
    const el = floatRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-d]"));
    const onMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      items.forEach((it) => {
        const d = Number(it.dataset.d);
        it.style.transform = `translate(${x * d}px, ${y * d}px)`;
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // 프로젝트마다 대표 화면(스플래시·홈)을 하나씩 골라 띄웁니다 (프로젝트를 고치면 같이 바뀝니다)
  const shots = projects
    .map((p) => p.images.find((i) => /splash|home/.test(i.src)) ?? p.images[0])
    .filter(Boolean)
    .slice(0, 3);
  const plainTagline = profile.tagline.replace(/\*\*/g, "");

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-text">
          <p className="hero-role">
            <span className="fade-swap" data-pending={!ready || undefined}>
              {profile.role}
              {profile.roleEn ? ` (${profile.roleEn})` : ""}
            </span>
          </p>
          <h1 id="hero-title" className="hero-tagline" aria-label={plainTagline}>
            <RisingTagline text={profile.tagline} />
          </h1>
          <p className="hero-sub">{HERO_SUB}</p>
          <div className="hero-actions">
            <Link href="/#projects" className="button">
              프로젝트 보기
            </Link>
            <Link href="/#contact" className="button button-ghost">
              연락하기
            </Link>
            <button type="button" className="button button-ghost" onClick={() => setResumeOpen(true)}>
              이력서 보기
            </button>
          </div>
        </div>

        <div className="hero-stage" ref={floatRef} aria-hidden="true">
          {shots.map((s, i) => (
            <div key={s.src} className={`hero-float hero-float-${i + 1}`} data-d={[28, -18, 36][i]}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.src} alt="" loading="eager" />
            </div>
          ))}
        </div>
      </div>
      {resumeOpen && <ResumeModal onClose={() => setResumeOpen(false)} />}
    </section>
  );
}
