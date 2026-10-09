"use client";

import { useState } from "react";
import ComposeMail from "./ComposeMail";
import { usePortfolio } from "./PortfolioProvider";

export default function Contact() {
  const { profile } = usePortfolio();
  const [composing, setComposing] = useState(false);

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container section-grid">
        <h2 id="contact-title" className="section-title">
          연락
        </h2>
        <div>
          <p className="prose lead">함께 일할 기회나 궁금한 점이 있다면 편하게 연락 주세요.</p>
          {profile.email && (
            <button type="button" className="contact-mail" onClick={() => setComposing(true)}>
              {profile.email}
            </button>
          )}
          {profile.github && (
            <div>
              <a
                className="contact-mail contact-github"
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                {profile.github.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
            </div>
          )}
        </div>
      </div>
      {composing && profile.email && (
        <ComposeMail to={profile.email} ownerName={profile.name} onClose={() => setComposing(false)} />
      )}
    </section>
  );
}
