"use client";

import { useEffect, useState } from "react";
import { CloseIcon } from "./Icons";
import { usePortfolio } from "./PortfolioProvider";
import { openResumePdf } from "@/lib/resume";

type Props = { onClose: () => void };

/** 메일 작성 창처럼 화면 오른쪽 아래에 뜨는 이력서 보기 창. PDF로 저장할 수 있다. */
export default function ResumeModal({ onClose }: Props) {
  const { profile, projects } = usePortfolio();
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const github = profile.github.replace(/^https?:\/\//, "").replace(/\/$/, "");

  function download() {
    setBlocked(!openResumePdf(profile, projects));
  }

  return (
    <div className="compose resume-pop" role="dialog" aria-label="이력서">
      <div className="compose-head">
        <span className="compose-title">{profile.name} 이력서</span>
        <button type="button" className="compose-close" onClick={onClose} aria-label="닫기">
          <CloseIcon />
        </button>
      </div>

      <div className="resume-body">
        <h3 className="resume-name">{profile.name}</h3>
        <p className="resume-role">
          {profile.role}
          {profile.nameEn ? ` · ${profile.nameEn}` : ""}
        </p>
        <p className="resume-contact">
          {[profile.email, github].filter(Boolean).join(" · ")}
        </p>

        {profile.about.length > 0 && (
          <section>
            <h4>소개</h4>
            {profile.about.map((t, i) => (
              <p key={`${i}-${t}`}>{t}</p>
            ))}
          </section>
        )}

        {profile.facts.length > 0 && (
          <section>
            <h4>학력 · 협업</h4>
            <dl className="resume-list">
              {profile.facts.map((f, i) => (
                <div key={`${i}-${f.label}`}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {profile.skills.length > 0 && (
          <section>
            <h4>기술</h4>
            <dl className="resume-list">
              {profile.skills.map((g, i) => (
                <div key={`${i}-${g.group}`}>
                  <dt>{g.group}</dt>
                  <dd>{g.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h4>프로젝트</h4>
            {projects.map((p) => (
              <div key={p.slug} className="resume-work">
                <div className="resume-work-head">
                  <strong>{p.title}</strong>
                  <span>{p.period}</span>
                </div>
                <p className="resume-sub">{p.type}</p>
                <p>{p.summary}</p>
              </div>
            ))}
          </section>
        )}
      </div>

      <div className="compose-foot resume-foot">
        <button type="button" className="btn btn-primary" onClick={download}>
          PDF 다운로드
        </button>
        {blocked && (
          <p className="form-error" role="alert">
            팝업이 막혀 있어요. 이 사이트의 팝업을 허용한 뒤 다시 눌러 주세요.
          </p>
        )}
        <p className="muted resume-hint">인쇄 창에서 대상을 &quot;PDF로 저장&quot;으로 고르면 파일이 만들어져요.</p>
      </div>
    </div>
  );
}
