"use client";

import { useState } from "react";
import { usePortfolio } from "./PortfolioProvider";

/** 로고는 위키미디어 커먼즈(위키백과 이미지 저장소)에서 불러오고, 글자가 붙은 가로형 로고만 아이콘형(devicon)을 씁니다. */
const WIKI = "https://commons.wikimedia.org/wiki/Special:FilePath/";
const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/";

type Logo = { src: string; tall?: boolean };

const wiki = (file: string, tall = false): Logo => ({
  src: `${WIKI}${encodeURI(file)}?width=120`,
  tall,
});

/** 기술 이름 → 로고. 목록에 없는 기술은 기본 아이콘으로 표시됩니다. */
const LOGOS: Record<string, Logo> = {
  html5: wiki("HTML5_logo_and_wordmark.svg", true),
  css3: wiki("CSS3_logo_and_wordmark.svg", true),
  javascript: wiki("Unofficial_JavaScript_logo_2.svg"),
  typescript: { src: `${DEVICON}typescript/typescript-original.svg` },
  react: wiki("React-icon.svg"),
  "react native": wiki("React-icon.svg"),
  "next.js": { src: `${DEVICON}nextjs/nextjs-original.svg` },
  php: wiki("PHP-logo.svg"),
  laravel: { src: `${DEVICON}laravel/laravel-original.svg` },
  mysql: { src: `${DEVICON}mysql/mysql-original.svg` },
  sqlite: wiki("Sqlite-square-icon.svg"),
  flutter: { src: `${DEVICON}flutter/flutter-original.svg` },
  dart: { src: `${DEVICON}dart/dart-original.svg` },
  firebase: wiki("Firebase_Logo_(No_wordmark)_(2024-).svg"),
  figma: wiki("Figma-logo.svg"),
  "git / github": { src: `${DEVICON}git/git-original.svg` },
  git: { src: `${DEVICON}git/git-original.svg` },
  github: wiki("GitHub_Invertocat_Logo.svg"),
  postman: wiki("Postman.svg"),
  vercel: { src: `${DEVICON}vercel/vercel-original.svg` },
  java: { src: `${DEVICON}java/java-original.svg` },
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
      className={`skill-logo ${logo.tall ? "skill-logo-tall" : ""}`.trim()}
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
