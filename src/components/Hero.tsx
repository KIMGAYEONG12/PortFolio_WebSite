"use client";

import Link from "next/link";
import Avatar from "./Avatar";
import { usePortfolio } from "./PortfolioProvider";

/** 소개 문구 안에서 진하게 보여줄 말 (없으면 그냥 일반 글씨로 나옵니다) */
const EMPHASIS = "개인 프로젝트";

export default function Hero() {
  const { profile, ready, canEdit } = usePortfolio();
  const longName = profile.name.length > 5;
  const introStart = profile.intro.indexOf(EMPHASIS);

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
          {profile.tagline && <p className="hero-tagline reveal reveal-3">{profile.tagline}</p>}
          <p className="hero-intro reveal reveal-3">
            {introStart >= 0 ? (
              <>
                {profile.intro.slice(0, introStart)}
                <strong>{EMPHASIS}</strong>
                {profile.intro.slice(introStart + EMPHASIS.length)}
              </>
            ) : (
              profile.intro
            )}
          </p>
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
            <Avatar photo={profile.photo} name={profile.name} size="clamp(120px, 20vw, 240px)" />
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
