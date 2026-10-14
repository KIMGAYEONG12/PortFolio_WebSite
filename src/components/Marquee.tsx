"use client";

/** 흘러가는 기술 띠. 마우스를 올리면 멈춥니다. */
const WORDS = ["Figma", "HTML5", "CSS3", "Tailwind CSS", "TypeScript", "React", "Next.js", "반응형", "웹 접근성", "UI/UX"];

export default function Marquee() {
  const row = WORDS.map((w) => <span key={w}>{w}</span>);
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <div className="marquee-row">{row}</div>
        <div className="marquee-row">{row}</div>
      </div>
    </div>
  );
}
