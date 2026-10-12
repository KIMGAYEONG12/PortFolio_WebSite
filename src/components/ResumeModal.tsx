"use client";

import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "./Icons";
import { usePortfolio } from "./PortfolioProvider";
import { openResumePdf, RESUME_URL } from "@/lib/resume";

type Props = { onClose: () => void };

/** 메일 작성 창처럼 화면 오른쪽 아래에 뜨는 이력서 보기 창. PDF로 저장할 수 있다. */
export default function ResumeModal({ onClose }: Props) {
  const { profile, projects } = usePortfolio();
  const [blocked, setBlocked] = useState(false);
  // 이력서 PDF 파일(public/resume.pdf)이 있는지: 있으면 PDF 뷰어로 보여 주고, 없으면 아래 글 이력서를 보여 준다
  const [pdf, setPdf] = useState<"checking" | "yes" | "no">("checking");

  useEffect(() => {
    let alive = true;
    fetch(RESUME_URL, { method: "HEAD" })
      .then((r) => {
        const type = r.headers.get("content-type") ?? "";
        if (alive) setPdf(r.ok && type.includes("pdf") ? "yes" : "no");
      })
      .catch(() => alive && setPdf("no"));
    return () => {
      alive = false;
    };
  }, []);

  // 제목 줄을 끌어서 창을 옮긴다 (PDF 뷰어일 때). pos 가 null 이면 CSS 기본 자리(화면 가운데).
  const popRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  function startDrag(e: React.PointerEvent<HTMLDivElement>) {
    if (pdf !== "yes" || (e.target as HTMLElement).closest("button")) return;
    const el = popRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - r.left;
    const dy = e.clientY - r.top;
    const move = (ev: PointerEvent) => {
      const x = Math.min(Math.max(0, ev.clientX - dx), window.innerWidth - r.width);
      const y = Math.min(Math.max(0, ev.clientY - dy), window.innerHeight - 48);
      setPos({ x, y });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    e.preventDefault();
  }

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
    <div
      ref={popRef}
      className={`compose resume-pop${pdf === "yes" ? " resume-pdf" : ""}`}
      style={pdf === "yes" && pos ? { left: pos.x, top: pos.y, right: "auto", bottom: "auto", transform: "none" } : undefined}
      role="dialog"
      aria-label="이력서"
    >
      <div className={`compose-head${pdf === "yes" ? " resume-drag" : ""}`} onPointerDown={startDrag}>
        <span className="compose-title">{profile.name} 이력서</span>
        <button type="button" className="compose-close" onClick={onClose} aria-label="닫기">
          <CloseIcon />
        </button>
      </div>

      {pdf === "yes" ? (
        <iframe className="resume-frame" src={`${RESUME_URL}#view=FitH`} title={`${profile.name} 이력서 PDF`} />
      ) : pdf === "checking" ? (
        <div className="resume-body">
          <p className="muted">이력서를 불러오는 중…</p>
        </div>
      ) : (
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
      )}

      <div className="compose-foot resume-foot">
        {pdf === "yes" ? (
          <>
            <a className="btn btn-primary" href={RESUME_URL} download={`${profile.name}_이력서.pdf`}>
              PDF 다운로드
            </a>
            <a className="btn" href={RESUME_URL} target="_blank" rel="noopener noreferrer">
              새 탭에서 열기
            </a>
          </>
        ) : (
        <button type="button" className="btn btn-primary" onClick={download}>
          PDF 다운로드
        </button>
        )}
        {blocked && (
          <p className="form-error" role="alert">
            팝업이 막혀 있어요. 이 사이트의 팝업을 허용한 뒤 다시 눌러 주세요.
          </p>
        )}
        {pdf !== "yes" && (
          <p className="muted resume-hint">인쇄 창에서 대상을 &quot;PDF로 저장&quot;으로 고르면 파일이 만들어져요.</p>
        )}
      </div>
    </div>
  );
}
