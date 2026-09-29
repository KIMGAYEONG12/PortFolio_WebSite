"use client";

import Link from "next/link";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { EditIcon, PlusIcon, TrashIcon } from "./Icons";
import { usePortfolio } from "./PortfolioProvider";
import ProjectEditor from "./ProjectEditor";

export default function ProjectList() {
  const { projects, deleteProject, toast } = usePortfolio();
  const [editor, setEditor] = useState<{ slug: string | null } | null>(null);
  const [deleting, setDeleting] = useState<{ slug: string; title: string } | null>(null);

  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container section-grid">
        <h2 id="projects-title" className="section-title">
          프로젝트
        </h2>
        <div>
          <div className="list-head">
            <button type="button" className="btn btn-primary btn-plus" onClick={() => setEditor({ slug: null })}>
              <PlusIcon size={16} /> 프로젝트 추가
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="empty">
              <p className="empty-title">아직 등록된 프로젝트가 없어요</p>
              <p className="muted">위의 + 프로젝트 추가 버튼으로 첫 프로젝트를 등록해 보세요.</p>
            </div>
          ) : (
            <ul className="project-list">
              {projects.map((p) => (
                <li key={p.slug}>
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
                  <Link href={`/projects/${p.slug}`} className="project-row">
                    <div className="project-meta">
                      <span>{p.period}</span>
                      <span>{p.type}</span>
                    </div>
                    <div className="project-main">
                      <h3 className="project-title">{p.title}</h3>
                      <p className="project-summary">{p.summary}</p>
                      <ul className="tags">
                        {p.stack.map((s) => (
                          <li key={s} className="tag">
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <span className="project-more">자세히 보기</span>
                  </Link>
                </li>
              ))}
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
