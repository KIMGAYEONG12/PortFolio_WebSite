"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * 처음 열릴 때 나오는 인트로: 숫자가 0에서 100까지 올라가고, 파란 막이 위로 걷히면서 히어로가 시작됩니다.
 * 홈("/")에서만 나오고, 동작 줄이기 설정이면 건너뜁니다. 오른쪽 위 "건너뛰기"로 바로 넘길 수 있습니다.
 */
export default function Intro() {
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(pathname !== "/");
  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (pathname !== "/" || reduce) {
      setGone(true);
      return;
    }
    html.classList.add("intro-on");
    document.body.style.overflow = "hidden";

    let done = false;
    let raf = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      root.current?.classList.add("out");
      document.body.style.overflow = "";
      timers.push(setTimeout(() => html.classList.remove("intro-on"), 350));
      timers.push(setTimeout(() => setGone(true), 1000));
    };
    finishRef.current = finish;

    let t0: number | null = null;
    const tick = (ts: number) => {
      if (done) return;
      if (t0 === null) t0 = ts;
      const p = Math.min(1, (ts - t0) / 1900);
      const e = 1 - Math.pow(1 - p, 3);
      if (num.current) num.current.textContent = String(Math.round(e * 100));
      if (bar.current) bar.current.style.transform = `scaleX(${e})`;
      if (p < 1) raf = requestAnimationFrame(tick);
      else timers.push(setTimeout(finish, 250));
    };
    raf = requestAnimationFrame(tick);

    return () => {
      done = true;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
      html.classList.remove("intro-on");
    };
  }, [pathname]);

  if (gone) return null;
  return (
    <>
      <noscript>
        <style>{"#intro{display:none!important}"}</style>
      </noscript>
      <div id="intro" ref={root} aria-hidden="true">
        <div className="intro-top">
          <span>PORTFOLIO 2026</span>
          <button type="button" className="intro-skip" onClick={() => finishRef.current()}>
            건너뛰기
          </button>
        </div>
        <div className="intro-bottom">
          <h2>
            <span className="intro-line">
              <span>Gayeong Kim</span>
            </span>
            <span className="intro-line">
              <span>Web Publisher</span>
            </span>
          </h2>
          <div className="intro-num">
            <span ref={num}>0</span>%
          </div>
        </div>
        <div className="intro-bar" ref={bar} />
      </div>
    </>
  );
}
