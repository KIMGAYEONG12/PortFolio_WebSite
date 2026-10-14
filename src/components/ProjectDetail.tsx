"use client";

import Link from "next/link";
import { usePortfolio } from "./PortfolioProvider";
import AutoGallery from "./AutoGallery";

export default function ProjectDetail({ slug }: { slug: string }) {
  const { projects, ready } = usePortfolio();

  let key = slug;
  try {
    key = decodeURIComponent(slug);
  } catch {
    /* 그대로 사용 */
  }
  const project = projects.find((p) => p.slug === key);

  // 사용자가 추가한 프로젝트는 브라우저 저장소를 읽은 뒤에야 찾을 수 있어요.
  if (!project) {
    if (!ready) {
      return (
        <article className="container detail" aria-busy="true">
          <p className="muted">불러오는 중...</p>
        </article>
      );
    }
    return (
      <section className="container notfound">
        <h1 className="notfound-title">프로젝트를 찾을 수 없어요</h1>
        <p className="muted">삭제되었거나 주소가 바뀐 프로젝트입니다. 홈에서 다시 찾아보세요.</p>
        <Link href="/#projects" className="button">
          프로젝트 목록으로
        </Link>
      </section>
    );
  }

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : null;
  const hasLinks = Boolean(project.live || project.github);

  return (
    <article className="container pd">
      <div className="pd-bar">
        <Link href="/#projects" className="pd-back">
          ← 프로젝트 목록
        </Link>
        <span className="pd-pos">
          {index + 1} / {projects.length}
        </span>
      </div>

      <p className="pd-type">
        {project.period}
        {project.type ? ` · ${project.type}` : ""}
      </p>
      <h1 className="pd-title">{project.title}</h1>
      {project.summary && <p className="pd-summary">{project.summary}</p>}

      {project.images.length > 0 && <AutoGallery images={project.images} label={`${project.title} 앱 화면`} />}

      <dl className="pd-list">
        {project.role && (
          <div>
            <dt>역할</dt>
            <dd>{project.role}</dd>
          </div>
        )}
        {project.stack.length > 0 && (
          <div>
            <dt>기술 스택</dt>
            <dd>
              <ul className="tags">
                {project.stack.map((s) => (
                  <li key={s} className="tag">
                    {s}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
        {project.overview && (
          <div>
            <dt>개요</dt>
            <dd>{project.overview}</dd>
          </div>
        )}
        {project.responsibilities.length > 0 && (
          <div>
            <dt>담당 업무</dt>
            <dd>
              <ul className="pd-bul">
                {project.responsibilities.map((r, i) => (
                  <li key={`${i}-${r}`}>{r}</li>
                ))}
              </ul>
            </dd>
          </div>
        )}
        {project.problems.length > 0 && (
          <div>
            <dt>문제 해결</dt>
            <dd>
              {project.problems.map((p, i) => (
                <div key={`${i}-${p.title}`} className="pd-prob">
                  {p.title && <h3>{p.title}</h3>}
                  {p.problem && (
                    <p>
                      <b>문제</b> {p.problem}
                    </p>
                  )}
                  {p.solution && (
                    <p>
                      <b>해결</b> {p.solution}
                    </p>
                  )}
                </div>
              ))}
            </dd>
          </div>
        )}
        {project.retrospective.length > 0 && (
          <div>
            <dt>회고</dt>
            <dd>
              <ul className="pd-bul">
                {project.retrospective.map((r, i) => (
                  <li key={`${i}-${r}`}>{r}</li>
                ))}
              </ul>
            </dd>
          </div>
        )}
        {hasLinks && (
          <div>
            <dt>링크</dt>
            <dd className="pd-links">
              {project.live && (
                <a className="button" href={project.live} target="_blank" rel="noopener noreferrer">
                  배포 사이트 열기
                </a>
              )}
              {project.github && (
                <a className="button button-ghost" href={project.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
            </dd>
          </div>
        )}
      </dl>

      {next && (
        <nav className="pd-next" aria-label="다음 프로젝트">
          <span>다음 프로젝트</span>
          <Link href={`/projects/${next.slug}`} className="pcard-more">
            <b aria-hidden="true">→</b>
            {next.title}
          </Link>
        </nav>
      )}
    </article>
  );
}
