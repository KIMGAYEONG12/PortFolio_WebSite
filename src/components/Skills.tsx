"use client";

import { usePortfolio } from "./PortfolioProvider";

const LOGO_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons";

/** 기술 이름 → 로고 파일 (devicon). 목록에 없는 기술은 기본 아이콘으로 표시됩니다. */
const LOGOS: Record<string, string> = {
  html5: "html5/html5-original",
  css3: "css3/css3-original",
  javascript: "javascript/javascript-original",
  typescript: "typescript/typescript-original",
  react: "react/react-original",
  "react native": "react/react-original",
  "next.js": "nextjs/nextjs-original",
  php: "php/php-original",
  laravel: "laravel/laravel-original",
  mysql: "mysql/mysql-original",
  sqlite: "sqlite/sqlite-original",
  flutter: "flutter/flutter-original",
  dart: "dart/dart-original",
  firebase: "firebase/firebase-original",
  figma: "figma/figma-original",
  "git / github": "git/git-original",
  git: "git/git-original",
  github: "github/github-original",
  postman: "postman/postman-original",
  vercel: "vercel/vercel-original",
  java: "java/java-original",
};

function Logo({ name }: { name: string }) {
  const file = LOGOS[name.trim().toLowerCase()];
  if (!file) {
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
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="skill-logo" src={`${LOGO_BASE}/${file}.svg`} alt="" width={18} height={18} />
  );
}

export default function Skills() {
  const { profile } = usePortfolio();

  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="container section-grid">
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
                    <Logo name={item} />
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
