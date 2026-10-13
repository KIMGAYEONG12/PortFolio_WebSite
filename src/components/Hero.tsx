"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import Avatar from "./Avatar";
import { usePortfolio } from "./PortfolioProvider";

export default function Hero() {
  const { profile, ready, canEdit } = usePortfolio();
  const longName = profile.name.length > 5;

  // 한 줄 소개를 글자 단위로 쪼개 순서대로 나타내기 위한 시작 번호
  const parts = profile.tagline.split(/\*\*(.+?)\*\*/g);
  const offsets: number[] = [];
  let typedLength = 0;
  for (const part of parts) {
    offsets.push(typedLength);
    typedLength += Array.from(part).length;
  }

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-text">
          <p className="hero-role reveal reveal-1">
            <span className="fade-swap" data-pending={!ready || undefined}>
              {profile.role}
              {profile.roleEn ? ` · ${profile.roleEn}` : ""}
            </span>
          </p>
          <h1
            id="hero-title"
            className={`hero-name reveal reveal-2 ${longName ? "hero-name-long" : ""}`.trim()}
          >
            <span className="fade-swap" data-pending={!ready || undefined}>
              {profile.name}
            </span>
          </h1>
          {profile.tagline && (
            <p
              className="hero-tagline"
              aria-label={profile.tagline.replace(/\*\*/g, "")}
              style={{ "--tl-end": `${0.6 + typedLength * 0.06}s` } as CSSProperties}
            >
              {profile.tagline.split(/\*\*(.+?)\*\*/g).map((part, i) => {
                const chars = Array.from(part).map((ch, j) => (
                  <span key={j} className="tl-ch" aria-hidden="true" style={{ "--i": offsets[i] + j } as CSSProperties}>
                    {ch}
                  </span>
                ));
                return i % 2 ? <em key={i}>{chars}</em> : <span key={i}>{chars}</span>;
              })}
              <span className="tl-caret" aria-hidden="true" />
            </p>
          )}
          <div className="hero-actions reveal reveal-4">
            <Link href="/#projects" className="button">
              프로젝트 보기
            </Link>
            {profile.github && (
              <a className="text-link" href={profile.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            )}
          </div>
        </div>

        <div className="hero-photo reveal reveal-3">
          <span className="fade-swap" data-pending={!ready || undefined}>
            <Avatar
              photo={profile.photo}
              name={profile.name}
              size="clamp(120px, 20vw, 240px)"
              x={profile.photoX}
              y={profile.photoY}
              zoom={profile.photoZoom}
            />
          </span>
          {ready && canEdit && !profile.photo && (
            <Link href="/my" className="hero-photo-hint">
              <span aria-hidden="true">+</span> 프로필 사진 추가
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
