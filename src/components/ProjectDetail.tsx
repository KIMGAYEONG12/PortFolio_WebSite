"use client";

import Link from "next/link";
import { usePortfolio } from "./PortfolioProvider";

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
    <article className="container detail">
      <Link href="/#projects" className="back-link">
        프로젝트 목록
      </Link>

      <header className="detail-head">
        {project.type && <p className="detail-type">{project.type}</p>}
        <h1 className="detail-title">{project.title}</h1>
        {project.summary && <p className="detail-summary">{project.summary}</p>}
      </header>

      <dl className="meta-list">
        {project.period && (
          <div className="meta-row">
            <dt>기간</dt>
            <dd>{project.period}</dd>
          </div>
        )}
        {project.role && (
          <div className="meta-row">
            <dt>맡은 역할</dt>
            <dd>{project.role}</dd>
          </div>
        )}
        {project.stack.length > 0 && (
          <div className="meta-row">
            <dt>사용 기술</dt>
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
        {hasLinks && (
          <div className="meta-row">
            <dt>링크</dt>
            <dd className="link-group">
              {project.live && (
                <a className="text-link" href={project.live} target="_blank" rel="noopener noreferrer">
                  배포 사이트
                </a>
              )}
              {project.github && (
                <a className="text-link" href={project.github} target="_blank" rel="noopener noreferrer">
                  GitHub 저장소
                </a>
              )}
            </dd>
          </div>
        )}
      </dl>

      {project.images.length > 0 && (
        <div className="shots">
          {project.images.map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`${i}-${img.src.slice(-24)}`} src={img.src} alt={img.alt} loading="lazy" className="shot" />
          ))}
        </div>
      )}

      {project.overview && (
        <section className="detail-section">
          <h2 className="detail-h2">프로젝트 소개</h2>
          <p className="prose">{project.overview}</p>
        </section>
      )}

      {project.responsibilities.length > 0 && (
        <section className="detail-section">
          <h2 className="detail-h2">담당한 작업</h2>
          <ul className="bullets">
            {project.responsibilities.map((r, i) => (
              <li key={`${i}-${r}`}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      {project.problems.length > 0 && (
        <section className="detail-section">
          <h2 className="detail-h2">문제 해결 경험</h2>
          <ul className="problems">
            {project.problems.map((p, i) => (
              <li key={`${i}-${p.title}`} className="problem">
                {p.title && <h3 className="problem-title">{p.title}</h3>}
                <dl className="problem-body">
                  {p.problem && (
                    <>
                      <dt>문제</dt>
                      <dd>{p.problem}</dd>
                    </>
                  )}
                  {p.solution && (
                    <>
                      <dt>해결</dt>
                      <dd>{p.solution}</dd>
                    </>
                  )}
                </dl>
              </li>
            ))}
          </ul>
        </section>
      )}

      {project.retrospective.length > 0 && (
        <section className="detail-section">
          <h2 className="detail-h2">아쉬운 점과 개선 계획</h2>
          <ul className="bullets">
            {project.retrospective.map((r, i) => (
              <li key={`${i}-${r}`}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      {next && (
        <nav className="next-project" aria-label="다음 프로젝트">
          <p className="muted">다음 프로젝트</p>
          <Link href={`/projects/${next.slug}`} className="next-link">
            {next.title}
          </Link>
        </nav>
      )}
    </article>
  );
}
