"use client";

import { usePortfolio } from "./PortfolioProvider";

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
