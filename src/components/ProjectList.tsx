"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { EditIcon, PlusIcon, TrashIcon } from "./Icons";
import { thumbnailOf } from "@/data/projects";
import { usePortfolio } from "./PortfolioProvider";
import ProjectEditor from "./ProjectEditor";

export default function ProjectList() {
  const { projects, deleteProject, toast, canEdit } = usePortfolio();
  const [editor, setEditor] = useState<{ slug: string | null } | null>(null);
  const [deleting, setDeleting] = useState<{ slug: string; title: string } | null>(null);

  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container section-grid">
        <div className="projects-head">
          <h2 id="projects-title" className="section-title">
            프로젝트
          </h2>
          <span className="projects-note">스크롤하면 카드가 쌓여요 · {projects.length}건</span>
        </div>
        <div>
          {canEdit && (
            <div className="list-head">
              <button type="button" className="btn btn-primary btn-plus" onClick={() => setEditor({ slug: null })}>
                <PlusIcon size={16} /> 프로젝트 추가
              </button>
            </div>
          )}

          {projects.length === 0 ? (
            <div className="empty">
              <p className="empty-title">아직 등록된 프로젝트가 없어요</p>
              <p className="muted">곧 프로젝트를 채워 넣을게요.</p>
            </div>
          ) : (
            <ul className="project-list">
              {projects.map((p, n) => {
                const thumb = thumbnailOf(p);
                // 카드에는 프로젝트의 첫 화면(시세 농부는 스플래시) 1장을 크게 보여 줍니다
                const srcs = p.images.length > 0 ? [p.images[0].src] : thumb ? [thumb] : [];
                return (
                  <li key={p.slug} className="pcard" style={{ "--n": n } as CSSProperties}>
                    {canEdit && (
                      <div className="project-tools">
                        <button type="button" className="btn btn-sm" onClick={() => setEditor({ slug: p.slug })}>
                          <EditIcon size={14} /> 수정
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => setDeleting({ slug: p.slug, title: p.title })}
                        >
                          <TrashIcon size={14} /> DEL
                        </button>
                      </div>
                    )}
                    <Link href={`/projects/${p.slug}`} className="pcard-link">
                      <div className="pcard-text">
                        <p className="pcard-meta">
                          {p.period}
                          {p.type ? ` · ${p.type}` : ""}
                        </p>
                        <h3 className="pcard-title">{p.title}</h3>
                        <p className="pcard-summary">{p.summary}</p>
                        {p.role && <p className="pcard-role">{p.role}</p>}
                        <ul className="tags">
                          {p.stack.map((s) => (
                            <li key={s} className="tag">
                              {s}
                            </li>
                          ))}
                        </ul>
                        <span className="pcard-more">
                          <b aria-hidden="true">→</b>자세히 보기
                        </span>
                      </div>
                      <div className="pcard-phones" aria-hidden="true">
                        {srcs.map((src, i) => (
                          <figure key={src} className="pcard-phone">
                            <div className="pcard-screen">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={src} alt="" loading={n === 0 || i === 0 ? "eager" : "lazy"} />
                            </div>
                          </figure>
                        ))}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {editor && <ProjectEditor slug={editor.slug} onClose={() => setEditor(null)} />}
      {deleting && (
        <ConfirmDialog
          title="프로젝트 삭제"
          message={`"${deleting.title}" 프로젝트를 삭제할까요? 삭제하면 되돌릴 수 없어요.`}
          okLabel="DEL"
          onOk={() => {
            deleteProject(deleting.slug);
            setDeleting(null);
            toast("프로젝트를 삭제했어요");
          }}
          onCancel={() => setDeleting(null)}
        />
      )}
    </section>
  );
}
