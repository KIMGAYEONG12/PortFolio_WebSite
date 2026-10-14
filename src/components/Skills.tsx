"use client";

import { useState } from "react";
import { usePortfolio } from "./PortfolioProvider";

/**
 * 로고는 위키미디어 커먼즈(위키백과 이미지 저장소)와 devicon에서 불러옵니다.
 * 모두 벡터(SVG) 원본이라 크기를 키워도 선명합니다. (?width= 같은 크기 옵션을 붙이면 흐린 PNG로 내려와요)
 */
const WIKI = "https://commons.wikimedia.org/wiki/Special:FilePath/";
const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/";
const DEVICON_NEW = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/";

type Logo = { src: string };

const dev = (name: string, style = "original"): Logo => ({ src: `${DEVICON}${name}/${name}-${style}.svg` });

/** 기술 이름 → 로고. 목록에 없는 기술은 기본 아이콘으로 표시됩니다. 같은 모양으로 보이도록 devicon 세트를 쓰고, 칸 크기도 모두 같습니다. */
const LOGOS: Record<string, Logo> = {
  html5: dev("html5"),
  css3: dev("css3"),
  javascript: dev("javascript"),
  typescript: dev("typescript"),
  react: dev("react"),
  "react native": dev("react"),
  "next.js": dev("nextjs"),
  zustand: { src: `${DEVICON_NEW}zustand/zustand-original.svg` },
  php: dev("php"),
  laravel: dev("laravel"),
  mysql: dev("mysql"),
  sqlite: dev("sqlite"),
  flutter: dev("flutter"),
  dart: dev("dart"),
  firebase: dev("firebase"),
  figma: dev("figma"),
  "git / github": dev("git"),
  git: dev("git"),
  github: dev("github"),
  postman: dev("postman"),
  vercel: dev("vercel"),
  java: dev("java"),
  supabase: dev("supabase"),
  "tailwind css": dev("tailwindcss"),
  // devicon에 없어서 위키미디어 로고를 같은 칸에 맞춰 넣습니다
  phpmyadmin: { src: `${WIKI}${encodeURI("PhpMyAdmin_logo.svg")}` },
  jupyter: dev("jupyter"),
  android: dev("android"),
  "android studio": { src: "/skills/android-studio.svg" }, // 안드로이드 스튜디오에 들어 있는 구글 공식 아이콘
};

function Fallback() {
  return (
    <svg
      className="skill-logo-fallback"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="8 6 2 12 8 18" />
      <polyline points="16 6 22 12 16 18" />
    </svg>
  );
}

function SkillLogo({ name }: { name: string }) {
  const [failed, setFailed] = useState(false);
  const logo = LOGOS[name.trim().toLowerCase()];
  if (!logo || failed) return <Fallback />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="skill-logo"
      src={logo.src}
      alt=""
      onError={() => setFailed(true)}
    />
  );
}

export default function Skills() {
  const { profile } = usePortfolio();

  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="container section-grid reveal-on-scroll">
        <h2 id="skills-title" className="section-title">
          기술
        </h2>
        <div className="skill-grid">
          {profile.skills.map((s, i) => (
            <article
              key={`${i}-${s.group}`}
              className={`skill-card ${s.group === "학습 중" ? "is-learning" : ""}`.trim()}
            >
              <header className="skill-card-head">
                <span className="skill-index" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="skill-group">{s.group}</h3>
              </header>
              <ul className="skill-chips">
                {s.items.map((item) => (
                  <li key={item} className="skill-chip">
                    <SkillLogo name={item} />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
