"use client";

import Link from "next/link";
import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import Avatar from "./Avatar";
import ConfirmDialog from "./ConfirmDialog";
import { CameraIcon, EditIcon, PlusIcon, TrashIcon } from "./Icons";
import ProfileEditor from "./ProfileEditor";
import ProjectEditor from "./ProjectEditor";
import { usePortfolio } from "./PortfolioProvider";
import { fileToResizedDataUrl } from "@/lib/image";

type ConfirmState = {
  title: string;
  message: string;
  okLabel: string;
  onOk: () => void;
} | null;

export default function MyDashboard() {
  const {
    profile,
    projects,
    ready,
    canEdit,
    saveError,
    updateProfile,
    deleteProject,
    toast,
  } = usePortfolio();

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [nameError, setNameError] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [projectEditor, setProjectEditor] = useState<{ slug: string | null } | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  const photoInput = useRef<HTMLInputElement>(null);

  const skillCount = profile.skills.reduce((sum, g) => sum + g.items.length, 0);

  /* ── 이름 수정 ── */
  function startNameEdit() {
    setNameDraft(profile.name);
    setNameError("");
    setEditingName(true);
  }
  function saveName() {
    const next = nameDraft.trim();
    if (!next) {
      setNameError("이름을 입력해 주세요.");
      return;
    }
    updateProfile({ name: next });
    setEditingName(false);
    toast("이름을 수정했어요");
  }
  function onNameKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      saveName();
    } else if (e.key === "Escape") {
      setEditingName(false);
    }
  }

  /* ── 프로필 사진 ── */
  async function onPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const photo = await fileToResizedDataUrl(file, { max: 480, square: true, quality: 0.88 });
      updateProfile({ photo });
      toast("프로필 사진을 바꿨어요");
    } catch (err) {
      toast(err instanceof Error ? err.message : "사진을 불러오지 못했어요");
    }
  }
  function askDeletePhoto() {
    setConfirm({
      title: "프로필 사진 삭제",
      message: "프로필 사진을 삭제할까요? 삭제하면 이름 이니셜이 대신 표시돼요.",
      okLabel: "DEL",
      onOk: () => {
        updateProfile({ photo: "" });
        setConfirm(null);
        toast("프로필 사진을 삭제했어요");
      },
    });
  }

  /* ── 프로젝트 삭제 ── */
  function askDeleteProject(slug: string, title: string) {
    setConfirm({
      title: "프로젝트 삭제",
      message: `"${title}" 프로젝트를 삭제할까요? 삭제하면 되돌릴 수 없어요.`,
      okLabel: "DEL",
      onOk: () => {
        deleteProject(slug);
        setConfirm(null);
        toast("프로젝트를 삭제했어요");
      },
    });
  }

  if (!ready) return <div className="container my" aria-busy="true" />;

  if (!canEdit) {
    return (
      <div className="container my is-ready">
        <header className="my-head">
          <p className="eyebrow">MY</p>
          <h1 className="my-title">관리 화면은 비공개예요</h1>
          <p className="my-lead">
            <Link href="/" className="text-link">
              홈으로 돌아가기
            </Link>
          </p>
        </header>
      </div>
    );
  }

  return (
    <div className={`container my ${ready ? "is-ready" : ""}`.trim()}>
      <header className="my-head">
        <p className="eyebrow">MY</p>
        <h1 className="my-title">내 포트폴리오 관리</h1>
        <p className="my-lead">프로필과 프로젝트를 여기서 바로 고치면 사이트에 즉시 반영돼요.</p>
      </header>

      {saveError && (
        <p className="banner-warn" role="alert">
          브라우저 저장 공간이 가득 차서 저장하지 못했어요. 스크린샷 수를 줄이거나 이미지를 삭제해 주세요.
          새로고침하면 방금 한 수정이 사라질 수 있어요.
        </p>
      )}

      {/* ── 프로젝트 관리 ── */}
      <section id="projects" className="my-section" aria-labelledby="my-projects-title">
        <div className="section-head">
          <h2 id="my-projects-title" className="my-h2">
            프로젝트 관리
          </h2>
          <button
            type="button"
            className="btn btn-primary btn-plus"
            onClick={() => setProjectEditor({ slug: null })}
          >
            <PlusIcon size={16} /> 프로젝트 추가
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="empty">
            <p className="empty-title">아직 프로젝트가 없어요</p>
            <p className="muted">+ 버튼으로 첫 프로젝트를 추가해 보세요.</p>
            <button type="button" className="btn btn-primary" onClick={() => setProjectEditor({ slug: null })}>
              <PlusIcon size={16} /> 프로젝트 추가
            </button>
          </div>
        ) : (
          <ul className="manage-list">
            {projects.map((p) => (
              <li key={p.slug} className="manage-row">
                <Link href={`/projects/${p.slug}`} className="manage-thumb" aria-label={`${p.title} 보기`}>
                  {p.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0].src} alt="" />
                  ) : (
                    <span aria-hidden="true">{p.title.trim().charAt(0)}</span>
                  )}
                </Link>
                <div className="manage-main">
                  <Link href={`/projects/${p.slug}`} className="manage-title">
                    {p.title}
                  </Link>
                  <p className="manage-sub muted">{[p.period, p.type].filter(Boolean).join(" · ")}</p>
                </div>
                <div className="manage-actions">
                  <button type="button" className="btn btn-sm" onClick={() => setProjectEditor({ slug: p.slug })}>
                    <EditIcon size={14} /> 수정
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => askDeleteProject(p.slug, p.title)}
                  >
                    <TrashIcon size={14} /> DEL
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── 프로필 카드 ── */}
      <section className="profile-card" aria-labelledby="my-profile-title">
        <div className="avatar-wrap">
          <Avatar photo={profile.photo} name={profile.name} size="clamp(112px, 24vw, 168px)" />
          <button
            type="button"
            className="avatar-plus"
            onClick={() => photoInput.current?.click()}
            aria-label={profile.photo ? "프로필 사진 변경" : "프로필 사진 추가"}
            title={profile.photo ? "사진 변경" : "사진 추가"}
          >
            <PlusIcon size={20} />
          </button>
          <input ref={photoInput} type="file" accept="image/*" hidden onChange={onPhoto} />
        </div>

        <div className="profile-info">
          <h2 id="my-profile-title" className="visually-hidden">
            프로필
          </h2>

          {editingName ? (
            <div className="name-edit">
              <input
                className="name-input"
                value={nameDraft}
                onChange={(e) => {
                  setNameDraft(e.target.value);
                  setNameError("");
                }}
                onKeyDown={onNameKey}
                maxLength={30}
                aria-label="이름"
                aria-invalid={Boolean(nameError)}
                autoFocus
              />
              <button type="button" className="btn btn-primary" onClick={saveName}>
                저장
              </button>
              <button type="button" className="btn" onClick={() => setEditingName(false)}>
                취소
              </button>
            </div>
          ) : (
            <div className="name-row">
              <p className="profile-name">{profile.name}</p>
              <button type="button" className="btn btn-sm" onClick={startNameEdit}>
                <EditIcon size={14} /> 이름 수정
              </button>
            </div>
          )}
          {nameError && (
            <p className="form-error" role="alert">
              {nameError}
            </p>
          )}

          <p className="profile-role">
            {profile.role}
            {profile.roleEn && <span className="muted"> · {profile.roleEn}</span>}
          </p>
          <p className="profile-tagline muted">{profile.tagline}</p>

          <ul className="profile-links">
            {profile.email && <li>{profile.email}</li>}
            {profile.github && <li>{profile.github.replace(/^https?:\/\//, "")}</li>}
          </ul>

          <div className="profile-actions">
            <button type="button" className="btn btn-primary" onClick={() => setProfileOpen(true)}>
              <EditIcon size={15} /> 프로필 수정
            </button>
            <button type="button" className="btn" onClick={() => photoInput.current?.click()}>
              <CameraIcon size={15} /> {profile.photo ? "사진 변경" : "사진 추가"}
            </button>
            {profile.photo && (
              <button type="button" className="btn btn-danger" onClick={askDeletePhoto}>
                <TrashIcon size={14} /> DEL
              </button>
            )}
          </div>
        </div>
      </section>

      <dl className="stats">
        <div className="stat">
          <dt>프로젝트</dt>
          <dd>{projects.length}</dd>
        </div>
        <div className="stat">
          <dt>기술 스택</dt>
          <dd>{skillCount}</dd>
        </div>
        <div className="stat">
          <dt>프로필 사진</dt>
          <dd>{profile.photo ? "등록됨" : "없음"}</dd>
        </div>
      </dl>

      {profileOpen && <ProfileEditor onClose={() => setProfileOpen(false)} />}
      {projectEditor && (
        <ProjectEditor slug={projectEditor.slug} onClose={() => setProjectEditor(null)} />
      )}
      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          message={confirm.message}
          okLabel={confirm.okLabel}
          onOk={confirm.onOk}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
