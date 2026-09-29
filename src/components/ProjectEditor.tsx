"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Modal from "./Modal";
import { CloseIcon, PlusIcon, TrashIcon } from "./Icons";
import { usePortfolio } from "./PortfolioProvider";
import { fileToResizedDataUrl } from "@/lib/image";
import type { Project } from "@/data/projects";

type Props = {
  /** 수정할 프로젝트의 slug. 없으면 새 프로젝트 추가 */
  slug: string | null;
  onClose: () => void;
};

const MAX_IMAGES = 8;

type FormState = {
  title: string;
  period: string;
  type: string;
  summary: string;
  role: string;
  stack: string;
  overview: string;
  responsibilities: string;
  problems: { title: string; problem: string; solution: string }[];
  retrospective: string;
  live: string;
  github: string;
  images: { src: string; alt: string }[];
};

const toLines = (text: string) =>
  text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

const withProtocol = (url: string) => {
  const v = url.trim();
  return v && !/^https?:\/\//i.test(v) ? `https://${v}` : v;
};

export default function ProjectEditor({ slug, onClose }: Props) {
  const { projects, addProject, updateProject, toast } = usePortfolio();
  const editing = slug ? projects.find((p) => p.slug === slug) ?? null : null;

  const [f, setF] = useState<FormState>(() => ({
    title: editing?.title ?? "",
    period: editing?.period ?? "",
    type: editing?.type ?? "",
    summary: editing?.summary ?? "",
    role: editing?.role ?? "",
    stack: editing?.stack.join(", ") ?? "",
    overview: editing?.overview ?? "",
    responsibilities: editing?.responsibilities.join("\n") ?? "",
    problems: editing?.problems.map((p) => ({ ...p })) ?? [],
    retrospective: editing?.retrospective.join("\n") ?? "",
    live: editing?.live ?? "",
    github: editing?.github ?? "",
    images: editing?.images.map((i) => ({ ...i })) ?? [],
  }));
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setF((prev) => ({ ...prev, [key]: value }));

  async function onImages(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    const room = MAX_IMAGES - f.images.length;
    if (room <= 0) {
      setError(`스크린샷은 최대 ${MAX_IMAGES}장까지 올릴 수 있어요.`);
      return;
    }
    setUploading(true);
    setError("");
    try {
      const added: { src: string; alt: string }[] = [];
      for (const file of files.slice(0, room)) {
        const src = await fileToResizedDataUrl(file, { max: 1400, quality: 0.82 });
        added.push({ src, alt: "" });
      }
      setF((prev) => ({ ...prev, images: [...prev.images, ...added] }));
      if (files.length > room) setError(`최대 ${MAX_IMAGES}장까지만 추가됐어요.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "이미지를 불러오지 못했어요.");
    } finally {
      setUploading(false);
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const title = f.title.trim();
    if (!title) {
      setError("프로젝트 제목을 입력해 주세요.");
      return;
    }

    const data: Omit<Project, "slug"> = {
      title,
      period: f.period.trim(),
      type: f.type.trim(),
      summary: f.summary.trim(),
      role: f.role.trim(),
      stack: f.stack
        .split(/[,，\n]/)
        .map((s) => s.trim())
        .filter(Boolean),
      overview: f.overview.trim(),
      responsibilities: toLines(f.responsibilities),
      problems: f.problems
        .map((p) => ({ title: p.title.trim(), problem: p.problem.trim(), solution: p.solution.trim() }))
        .filter((p) => p.title || p.problem || p.solution),
      retrospective: toLines(f.retrospective),
      live: withProtocol(f.live),
      github: withProtocol(f.github),
      images: f.images.map((img, i) => ({
        src: img.src,
        alt: img.alt.trim() || `${title} 화면 ${i + 1}`,
      })),
    };

    if (editing) {
      updateProject(editing.slug, { ...data, slug: editing.slug });
      toast("프로젝트를 수정했어요");
    } else {
      addProject(data);
      toast("프로젝트를 추가했어요");
    }
    onClose();
  }

  return (
    <Modal
      title={editing ? "프로젝트 수정" : "프로젝트 추가"}
      onClose={onClose}
      wide
      footer={
        <>
          <button type="button" className="btn" onClick={onClose}>
            취소
          </button>
          <button type="submit" form="project-form" className="btn btn-primary" disabled={uploading}>
            {editing ? "수정 완료" : "추가"}
          </button>
        </>
      }
    >
      <form id="project-form" className="form" onSubmit={submit} noValidate>
        <label className="field">
          <span className="field-label">프로젝트 제목 *</span>
          <input value={f.title} onChange={(e) => set("title", e.target.value)} maxLength={60} autoFocus />
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field-label">기간</span>
            <input
              placeholder="예: 2026.08 ~ 진행 중"
              value={f.period}
              onChange={(e) => set("period", e.target.value)}
            />
          </label>
          <label className="field">
            <span className="field-label">유형</span>
            <input
              placeholder="예: 팀 프로젝트 · 프론트엔드"
              value={f.type}
              onChange={(e) => set("type", e.target.value)}
            />
          </label>
        </div>

        <label className="field">
          <span className="field-label">한 줄 요약</span>
          <textarea rows={2} value={f.summary} onChange={(e) => set("summary", e.target.value)} />
        </label>

        <label className="field">
          <span className="field-label">맡은 역할</span>
          <input value={f.role} onChange={(e) => set("role", e.target.value)} />
        </label>

        <label className="field">
          <span className="field-label">사용 기술</span>
          <input
            placeholder="쉼표로 구분 (예: Next.js, TypeScript, Vercel)"
            value={f.stack}
            onChange={(e) => set("stack", e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field-label">프로젝트 소개</span>
          <textarea rows={4} value={f.overview} onChange={(e) => set("overview", e.target.value)} />
        </label>

        <label className="field">
          <span className="field-label">담당한 작업</span>
          <textarea
            rows={4}
            value={f.responsibilities}
            onChange={(e) => set("responsibilities", e.target.value)}
          />
          <span className="field-hint">한 줄에 하나씩 적어 주세요.</span>
        </label>

        <fieldset className="field-group">
          <legend className="field-label">문제 해결 경험</legend>
          {f.problems.map((p, i) => (
            <div key={i} className="repeat-item">
              <div className="repeat-item-head">
                <span className="field-hint">경험 {i + 1}</span>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => set("problems", f.problems.filter((_, idx) => idx !== i))}
                >
                  <TrashIcon size={14} /> DEL
                </button>
              </div>
              <input
                placeholder="제목"
                value={p.title}
                onChange={(e) =>
                  set("problems", f.problems.map((x, idx) => (idx === i ? { ...x, title: e.target.value } : x)))
                }
              />
              <textarea
                rows={2}
                placeholder="문제"
                value={p.problem}
                onChange={(e) =>
                  set("problems", f.problems.map((x, idx) => (idx === i ? { ...x, problem: e.target.value } : x)))
                }
              />
              <textarea
                rows={2}
                placeholder="해결"
                value={p.solution}
                onChange={(e) =>
                  set("problems", f.problems.map((x, idx) => (idx === i ? { ...x, solution: e.target.value } : x)))
                }
              />
            </div>
          ))}
          <button
            type="button"
            className="btn btn-add"
            onClick={() => set("problems", [...f.problems, { title: "", problem: "", solution: "" }])}
          >
            <PlusIcon size={16} /> 문제 해결 추가
          </button>
        </fieldset>

        <label className="field">
          <span className="field-label">아쉬운 점과 개선 계획</span>
          <textarea
            rows={3}
            value={f.retrospective}
            onChange={(e) => set("retrospective", e.target.value)}
          />
          <span className="field-hint">한 줄에 하나씩 적어 주세요.</span>
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field-label">배포 사이트 주소</span>
            <input value={f.live} onChange={(e) => set("live", e.target.value)} />
          </label>
          <label className="field">
            <span className="field-label">GitHub 저장소 주소</span>
            <input value={f.github} onChange={(e) => set("github", e.target.value)} />
          </label>
        </div>

        <fieldset className="field-group">
          <legend className="field-label">
            스크린샷 ({f.images.length}/{MAX_IMAGES})
          </legend>
          {f.images.length > 0 && (
            <ul className="image-edit-list">
              {f.images.map((img, i) => (
                <li key={i} className="image-edit-item">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt="" />
                  <input
                    placeholder="이미지 설명 (선택)"
                    value={img.alt}
                    onChange={(e) =>
                      set("images", f.images.map((x, idx) => (idx === i ? { ...x, alt: e.target.value } : x)))
                    }
                  />
                  <button
                    type="button"
                    className="icon-btn icon-btn-ghost"
                    aria-label={`스크린샷 ${i + 1} 삭제`}
                    onClick={() => set("images", f.images.filter((_, idx) => idx !== i))}
                  >
                    <CloseIcon size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={onImages}
          />
          <button
            type="button"
            className="btn btn-add"
            onClick={() => fileRef.current?.click()}
            disabled={uploading || f.images.length >= MAX_IMAGES}
          >
            <PlusIcon size={16} /> {uploading ? "불러오는 중..." : "스크린샷 추가"}
          </button>
        </fieldset>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
