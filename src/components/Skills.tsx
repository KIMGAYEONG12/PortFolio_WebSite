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
        <dl className="meta-list">
          {profile.skills.map((s, i) => (
            <div key={`${i}-${s.group}`} className="meta-row">
              <dt>{s.group}</dt>
              <dd>{s.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
