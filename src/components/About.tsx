"use client";

import { usePortfolio } from "./PortfolioProvider";

export default function About() {
  const { profile } = usePortfolio();

  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container section-grid reveal-on-scroll">
        <h2 id="about-title" className="section-title">
          경험 · 활동 · 교육
        </h2>
        <div className="about-content">
          {profile.about.length > 0 && (
            <div className="prose-group">
              {profile.about.map((text, i) => (
                <p key={`${i}-${text}`} className="prose lead">
                  {text}
                </p>
              ))}
            </div>
          )}
          {profile.facts.length > 0 && (
            <dl className="meta-list">
              {profile.facts.map((f, i) => (
                <div key={`${i}-${f.label}`} className="meta-row">
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}
