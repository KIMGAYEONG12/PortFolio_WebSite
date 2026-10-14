"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/** 인트로가 끝났을 때(또는 처음부터 건너뛸 때) AutoTour에게 알리는 신호 */
export const INTRO_DONE_EVENT = "portfolio:intro-done";

type IntroWindow = Window & { __introHandled?: boolean };

/**
 * 처음 열릴 때 나오는 인트로: 숫자가 0에서 100까지 올라가고, 파란 막이 위로 걷히면서 히어로가 시작됩니다.
 * - 사이트를 처음 열었을 때 한 번만 나옵니다. (프로젝트 상세 → 목록으로 돌아올 때는 다시 나오지 않아요)
 * - 홈("/")이 아닌 주소로 들어오면 나오지 않고, 동작 줄이기 설정이면 건너뜁니다.
 * - 오른쪽 위 "건너뛰기"로 바로 넘길 수 있습니다.
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
    const w = window as IntroWindow;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 이미 한 번 처리했거나, 홈이 아닌 곳으로 들어왔거나, 동작 줄이기 설정이면 인트로 없이 시작
    if (w.__introHandled || pathname !== "/" || reduce) {
      const first = !w.__introHandled;
      w.__introHandled = true;
      setGone(true);
      // AutoTour가 듣기 시작한 뒤에 신호를 보내도록 한 박자 늦춥니다
      if (first && pathname === "/") setTimeout(() => window.dispatchEvent(new Event(INTRO_DONE_EVENT)), 0);
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
      w.__introHandled = true;
      cancelAnimationFrame(raf);
      root.current?.classList.add("out");
      document.body.style.overflow = "";
      timers.push(
        setTimeout(() => {
          html.classList.remove("intro-on");
          // 새로고침하면 브라우저가 예전 스크롤 위치를 되살리므로, 자동 이동이 맨 위에서 시작되게 합니다
          if (!window.location.hash) window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
          window.dispatchEvent(new Event(INTRO_DONE_EVENT));
        }, 350),
      );
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
      // 인트로가 끝나기 전에 떠나면 잠금만 풀어 둡니다
      if (!done) {
        done = true;
        cancelAnimationFrame(raf);
        timers.forEach(clearTimeout);
        document.body.style.overflow = "";
        html.classList.remove("intro-on");
      }
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
