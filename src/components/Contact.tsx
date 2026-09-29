"use client";

import { usePortfolio } from "./PortfolioProvider";

export default function Contact() {
  const { profile } = usePortfolio();

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container section-grid">
        <h2 id="contact-title" className="section-title">
          연락
        </h2>
        <div>
          <p className="prose lead">함께 일할 기회나 궁금한 점이 있다면 편하게 연락 주세요.</p>
          {profile.email && (
            <a className="contact-mail" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          )}
          {profile.github && (
            <p>
              <a className="text-link" href={profile.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
