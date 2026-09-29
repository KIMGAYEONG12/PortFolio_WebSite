"use client";

import { useState, type FormEvent } from "react";
import Modal from "./Modal";
import { PlusIcon, TrashIcon } from "./Icons";
import { usePortfolio } from "./PortfolioProvider";

type FormState = {
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  tagline: string;
  intro: string;
  email: string;
  github: string;
  about: string;
  facts: { label: string; value: string }[];
  skills: { group: string; items: string }[];
};

export default function ProfileEditor({ onClose }: { onClose: () => void }) {
  const { profile, updateProfile, toast } = usePortfolio();
  const [f, setF] = useState<FormState>(() => ({
    name: profile.name,
    nameEn: profile.nameEn,
    role: profile.role,
    roleEn: profile.roleEn,
    tagline: profile.tagline,
    intro: profile.intro,
    email: profile.email,
    github: profile.github,
    about: profile.about.join("\n\n"),
    facts: profile.facts.map((x) => ({ ...x })),
    skills: profile.skills.map((s) => ({ group: s.group, items: s.items.join(", ") })),
  }));
  const [error, setError] = useState("");

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setF((prev) => ({ ...prev, [key]: value }));

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!f.name.trim()) {
      setError("이름을 입력해 주세요.");
      return;
    }
    const email = f.email.trim();
    if (email && !email.includes("@")) {
      setError("이메일 형식을 확인해 주세요.");
      return;
    }
    let github = f.github.trim();
    if (github && !/^https?:\/\//i.test(github)) github = `https://${github}`;

    updateProfile({
      name: f.name.trim(),
      nameEn: f.nameEn.trim(),
      role: f.role.trim(),
      roleEn: f.roleEn.trim(),
      tagline: f.tagline.trim(),
      intro: f.intro.trim(),
      email,
      github,
      about: f.about
        .split(/\n\s*\n/)
        .map((s) => s.trim())
        .filter(Boolean),
      facts: f.facts
        .map((x) => ({ label: x.label.trim(), value: x.value.trim() }))
        .filter((x) => x.label || x.value),
      skills: f.skills
        .map((s) => ({
          group: s.group.trim(),
          items: s.items
            .split(/[,，\n]/)
            .map((t) => t.trim())
            .filter(Boolean),
        }))
        .filter((s) => s.group || s.items.length),
    });
    toast("프로필을 저장했어요");
    onClose();
  }

  return (
    <Modal
      title="프로필 수정"
      onClose={onClose}
      wide
      footer={
        <>
          <button type="button" className="btn" onClick={onClose}>
            취소
          </button>
          <button type="submit" form="profile-form" className="btn btn-primary">
            저장
          </button>
        </>
      }
    >
      <form id="profile-form" className="form" onSubmit={submit} noValidate>
        <div className="field-row">
          <label className="field">
            <span className="field-label">이름 *</span>
            <input value={f.name} onChange={(e) => set("name", e.target.value)} maxLength={30} autoFocus />
          </label>
          <label className="field">
            <span className="field-label">영문 이름</span>
            <input value={f.nameEn} onChange={(e) => set("nameEn", e.target.value)} maxLength={60} />
          </label>
        </div>

        <div className="field-row">
          <label className="field">
            <span className="field-label">직무</span>
            <input value={f.role} onChange={(e) => set("role", e.target.value)} maxLength={40} />
          </label>
          <label className="field">
            <span className="field-label">직무 (영문)</span>
            <input value={f.roleEn} onChange={(e) => set("roleEn", e.target.value)} maxLength={60} />
          </label>
        </div>

        <label className="field">
          <span className="field-label">한 줄 소개</span>
          <input value={f.tagline} onChange={(e) => set("tagline", e.target.value)} maxLength={80} />
        </label>

        <label className="field">
          <span className="field-label">짧은 소개</span>
          <textarea rows={2} value={f.intro} onChange={(e) => set("intro", e.target.value)} />
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field-label">이메일</span>
            <input
              type="email"
              inputMode="email"
              value={f.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </label>
          <label className="field">
            <span className="field-label">GitHub 주소</span>
            <input value={f.github} onChange={(e) => set("github", e.target.value)} />
          </label>
        </div>

        <label className="field">
          <span className="field-label">소개 글</span>
          <textarea rows={6} value={f.about} onChange={(e) => set("about", e.target.value)} />
          <span className="field-hint">문단은 빈 줄로 구분해 주세요.</span>
        </label>

        <fieldset className="field-group">
          <legend className="field-label">소개 항목 (교육 · 관심 분야 등)</legend>
          {f.facts.map((fact, i) => (
            <div key={i} className="repeat-item">
              <div className="repeat-item-head">
                <span className="field-hint">항목 {i + 1}</span>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => set("facts", f.facts.filter((_, idx) => idx !== i))}
                >
                  <TrashIcon size={14} /> DEL
                </button>
              </div>
              <input
                placeholder="제목 (예: 교육)"
                value={fact.label}
                onChange={(e) =>
                  set("facts", f.facts.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)))
                }
              />
              <textarea
                rows={2}
                placeholder="내용"
                value={fact.value}
                onChange={(e) =>
                  set("facts", f.facts.map((x, idx) => (idx === i ? { ...x, value: e.target.value } : x)))
                }
              />
            </div>
          ))}
          <button
            type="button"
            className="btn btn-add"
            onClick={() => set("facts", [...f.facts, { label: "", value: "" }])}
          >
            <PlusIcon size={16} /> 항목 추가
          </button>
        </fieldset>

        <fieldset className="field-group">
          <legend className="field-label">기술 스택</legend>
          {f.skills.map((s, i) => (
            <div key={i} className="repeat-item">
              <div className="repeat-item-head">
                <span className="field-hint">그룹 {i + 1}</span>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => set("skills", f.skills.filter((_, idx) => idx !== i))}
                >
                  <TrashIcon size={14} /> DEL
                </button>
              </div>
              <input
                placeholder="그룹 이름 (예: 프론트엔드)"
                value={s.group}
                onChange={(e) =>
                  set("skills", f.skills.map((x, idx) => (idx === i ? { ...x, group: e.target.value } : x)))
                }
              />
              <input
                placeholder="쉼표로 구분 (예: React, Next.js, TypeScript)"
                value={s.items}
                onChange={(e) =>
                  set("skills", f.skills.map((x, idx) => (idx === i ? { ...x, items: e.target.value } : x)))
                }
              />
            </div>
          ))}
          <button
            type="button"
            className="btn btn-add"
            onClick={() => set("skills", [...f.skills, { group: "", items: "" }])}
          >
            <PlusIcon size={16} /> 그룹 추가
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
