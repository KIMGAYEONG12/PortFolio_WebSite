import { defaultProfile, type Profile, type Fact, type SkillGroup } from "@/data/profile";
import type { Project } from "@/data/projects";

type Obj = Record<string, unknown>;
const asObj = (v: unknown): Obj => (v && typeof v === "object" ? (v as Obj) : {});
const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);

/** 저장된/가져온 프로필 데이터를 안전한 Profile 형태로 맞춥니다. */
export function normalizeProfile(raw: unknown): Profile {
  const r = asObj(raw);
  const d = defaultProfile;

  const facts: Fact[] = Array.isArray(r.facts)
    ? r.facts
        .map((f) => ({ label: str(asObj(f).label), value: str(asObj(f).value) }))
        .filter((f) => f.label || f.value)
    : d.facts;

  const skills: SkillGroup[] = Array.isArray(r.skills)
    ? r.skills
        .map((s) => {
          const o = asObj(s);
          return {
            group: str(o.group),
            items: Array.isArray(o.items)
              ? o.items.filter((x): x is string => typeof x === "string" && x.trim() !== "")
              : [],
          };
        })
        .filter((s) => s.group || s.items.length)
    : d.skills;

  const about: string[] = Array.isArray(r.about)
    ? r.about.filter((x): x is string => typeof x === "string" && x.trim() !== "")
    : d.about;

  return {
    name: str(r.name).trim() || d.name,
    nameEn: str(r.nameEn, d.nameEn),
    role: str(r.role, d.role),
    roleEn: str(r.roleEn, d.roleEn),
    tagline: str(r.tagline, d.tagline),
    intro: str(r.intro, d.intro),
    description: str(r.description, d.description),
    email: str(r.email, d.email),
    github: str(r.github, d.github),
    photo: str(r.photo, ""),
    about,
    facts,
    skills,
    navigation: d.navigation,
  };
}

/** 저장된/가져온 프로젝트 데이터를 안전한 Project 형태로 맞춥니다. 형식이 틀리면 null. */
export function normalizeProject(raw: unknown): Project | null {
  const r = asObj(raw);
  const slug = str(r.slug).trim();
  const title = str(r.title).trim();
  if (!slug || !title) return null;

  const lines = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "") : [];

  return {
    slug,
    title,
    period: str(r.period),
    type: str(r.type),
    summary: str(r.summary),
    role: str(r.role),
    stack: lines(r.stack),
    overview: str(r.overview),
    responsibilities: lines(r.responsibilities),
    problems: Array.isArray(r.problems)
      ? r.problems
          .map((p) => {
            const o = asObj(p);
            return { title: str(o.title), problem: str(o.problem), solution: str(o.solution) };
          })
          .filter((p) => p.title || p.problem || p.solution)
      : [],
    retrospective: lines(r.retrospective),
    live: str(r.live),
    github: str(r.github),
    images: Array.isArray(r.images)
      ? r.images
          .map((i) => ({ src: str(asObj(i).src), alt: str(asObj(i).alt) }))
          .filter((i) => i.src)
      : [],
  };
}

/** 제목으로 URL용 slug를 만듭니다. (한글 제목은 인코딩 문제를 피하려고 임의 ID를 사용) */
export function makeSlug(title: string, existing: string[]): string {
  const base =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || `project-${Date.now().toString(36)}`;
  let slug = base;
  let n = 2;
  while (existing.includes(slug)) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

/** 저장 데이터 형식 버전. 기본값이 바뀌었을 때 옛 저장본을 한 번만 보정하는 데 씁니다. */
export const DATA_VERSION = 5;

const OLD_ROLE = "프론트엔드 개발자";
const OLD_ROLE_V2 = "프론트 및 웹 앱 개발자";
const OLD_ROLE_EN = "Frontend Developer";
const OLD_DESC =
  "홍길동의 프론트엔드 개발 포트폴리오. Next.js, React, TypeScript로 만든 팀 프로젝트와 개인 프로젝트를 소개합니다.";

// v4 기본값 (v5로 올라올 때, 사용자가 직접 바꾸지 않은 경우에만 새 기본값으로 교체)
const OLD_INTRO_V4 =
  "Next.js와 TypeScript로 화면을 만들고, 팀 프로젝트에서 API 연동과 반응형 UI를 맡았습니다. 지금은 Flutter와 Firebase로 개인 프로젝트 시세 농부를 만들고 있습니다.";
const OLD_SKILLS_V4 = JSON.stringify([
  {
    group: "프론트엔드",
    items: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Next.js", "Zustand", "Flutter"],
  },
  { group: "백엔드 · DB", items: ["PHP", "Laravel", "MySQL", "SQLite"] },
  { group: "디자인 · 협업", items: ["Figma", "Git / GitHub", "Postman", "Vercel"] },
  { group: "학습 중", items: ["React Native", "Java", "Flutter", "Firebase", "CLI"] },
]);

/**
 * v1 → v2: 직무 문구를 "프론트 및 웹 앱 개발자"로 바꾸고 Flutter를 기술에 추가합니다.
 * 사용자가 직접 다른 문구로 바꿔 둔 값은 건드리지 않습니다.
 */
export function migrateProfile(p: Profile): Profile {
  const next: Profile = { ...p };
  if (next.role === OLD_ROLE || next.role === OLD_ROLE_V2) next.role = defaultProfile.role;
  if (next.roleEn === OLD_ROLE_EN) next.roleEn = defaultProfile.roleEn;
  if (next.description === OLD_DESC) next.description = defaultProfile.description;

  // v3 → v4: 소개 항목에서 "교육" 제거, GitHub 주소·소개 글 갱신 (직접 바꾼 값은 유지)
  next.facts = next.facts.filter(
    (f) => !(f.label === "교육" && f.value.startsWith("생성형 AI 기반 UI/UX디자인")),
  );
  if (next.github === "https://github.com/your-id") next.github = defaultProfile.github;
  if (next.about.length === 2 && next.about[0].startsWith("Next.js와 TypeScript로 화면을 만들고, PHP·SQLite·MySQL")) {
    next.about = [...defaultProfile.about];
  }

  // v4 → v5: 소개 문구에 출시 계획 추가, 기술 분류 정리 (직접 바꾼 값은 유지)
  if (next.intro === OLD_INTRO_V4) next.intro = defaultProfile.intro;
  if (JSON.stringify(next.skills) === OLD_SKILLS_V4) {
    next.skills = defaultProfile.skills.map((g) => ({ ...g, items: [...g.items] }));
  }

  const hasFlutter = next.skills.some((g) => g.items.some((i) => /flutter|플러터/i.test(i)));
  if (!hasFlutter) {
    const skills = next.skills.map((g) => ({ ...g, items: [...g.items] }));
    const target = skills.find((g) => g.group === "프론트엔드") ?? skills[0];
    if (target) target.items.push("Flutter");
    else skills.push({ group: "프론트엔드", items: ["Flutter"] });
    next.skills = skills;
  }
  return next;
}
