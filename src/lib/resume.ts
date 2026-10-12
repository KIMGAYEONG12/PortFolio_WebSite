import type { Profile } from "@/data/profile";
import type { Project } from "@/data/projects";

/**
 * 이력서 PDF 파일 위치. 파일을 바꾸려면 public/resume.pdf 를 같은 이름으로 교체한 뒤 올리면 된다.
 * 브라우저가 옛 파일을 기억하면 RESUME_VERSION 숫자만 1씩 올려 주세요.
 */
export const RESUME_FILE = "/resume.pdf";
export const RESUME_VERSION = 1;
export const RESUME_URL = `${RESUME_FILE}?v=${RESUME_VERSION}`;

/** HTML 글자로 안전하게 바꾼다 (프로필·프로젝트 글에 < > & 가 있어도 깨지지 않게) */
export function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * 이력서를 인쇄·PDF 저장용 한 장짜리 문서(HTML)로 만든다.
 * 브라우저의 "PDF로 저장"으로 저장하면 글자가 그대로 선택·검색되는 PDF가 된다.
 */
export function buildResumeHtml(profile: Profile, projects: Project[]): string {
  const github = profile.github.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const contact = [profile.email, github].filter(Boolean).map(esc).join(" · ");

  const about = profile.about.map((t) => `<p>${esc(t)}</p>`).join("");
  const facts = profile.facts
    .map((f) => `<tr><th>${esc(f.label)}</th><td>${esc(f.value)}</td></tr>`)
    .join("");
  const skills = profile.skills
    .map((g) => `<tr><th>${esc(g.group)}</th><td>${g.items.map(esc).join(", ")}</td></tr>`)
    .join("");
  const works = projects
    .map(
      (p) => `
      <div class="work">
        <div class="work-head"><strong>${esc(p.title)}</strong><span>${esc(p.period)}</span></div>
        <div class="sub">${esc(p.type)}${p.role ? ` · ${esc(p.role)}` : ""}</div>
        <p>${esc(p.summary)}</p>
        ${p.stack.length ? `<div class="stack">${p.stack.map(esc).join(" · ")}</div>` : ""}
        ${p.responsibilities.length ? `<ul>${p.responsibilities.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>` : ""}
      </div>`,
    )
    .join("");

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<title>${esc(profile.name)} | 이력서</title>
<style>
  @page { size: A4; margin: 16mm 14mm; }
  * { box-sizing: border-box; }
  body { margin: 0; color: #1b1b1f; font-family: "Pretendard Variable", Pretendard, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif; font-size: 10.5pt; line-height: 1.6; }
  h1 { margin: 0; font-size: 22pt; letter-spacing: -0.02em; }
  .role { color: #23315a; font-weight: 600; margin-top: 2px; }
  .contact { color: #666670; font-size: 9.5pt; margin-top: 6px; }
  header { padding-bottom: 12px; border-bottom: 2px solid #23315a; margin-bottom: 14px; }
  h2 { margin: 18px 0 8px; font-size: 11.5pt; color: #23315a; border-bottom: 1px solid #e8e8ec; padding-bottom: 4px; }
  p { margin: 0 0 6px; }
  table { width: 100%; border-collapse: collapse; }
  th { width: 26%; text-align: left; vertical-align: top; padding: 4px 8px 4px 0; font-weight: 600; }
  td { padding: 4px 0; color: #333; }
  .work { margin-bottom: 12px; page-break-inside: avoid; }
  .work-head { display: flex; justify-content: space-between; gap: 12px; }
  .work-head span, .sub { color: #666670; font-size: 9.5pt; }
  .stack { color: #23315a; font-size: 9.5pt; margin: 2px 0; }
  ul { margin: 4px 0 0; padding-left: 18px; }
  li { margin: 1px 0; }
</style>
</head>
<body>
  <header>
    <h1>${esc(profile.name)}</h1>
    <div class="role">${esc(profile.role)}${profile.nameEn ? ` · ${esc(profile.nameEn)}` : ""}</div>
    <div class="contact">${contact}</div>
  </header>
  ${about ? `<h2>소개</h2>${about}` : ""}
  ${facts ? `<h2>학력 · 협업</h2><table>${facts}</table>` : ""}
  ${skills ? `<h2>기술</h2><table>${skills}</table>` : ""}
  ${works ? `<h2>프로젝트</h2>${works}` : ""}
</body>
</html>`;
}

/**
 * 이력서를 새 창에 띄우고 인쇄 창을 연다. 인쇄 창의 대상(프린터)을 "PDF로 저장"으로 고르면 PDF 파일이 만들어진다.
 * 팝업이 막혀 있으면 false.
 */
export function openResumePdf(profile: Profile, projects: Project[]): boolean {
  const w = window.open("", "_blank");
  if (!w) return false;
  w.document.open();
  w.document.write(buildResumeHtml(profile, projects));
  w.document.close();
  w.focus();
  // 글꼴이 불러와진 뒤에 인쇄 창을 연다
  const go = () => w.print();
  if (w.document.readyState === "complete") setTimeout(go, 300);
  else w.addEventListener("load", () => setTimeout(go, 300));
  return true;
}
