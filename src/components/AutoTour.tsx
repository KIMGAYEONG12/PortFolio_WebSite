"use client";

import { useEffect } from "react";
import { INTRO_DONE_EVENT } from "./Intro";

/** 한 장을 보여 주는 시간(ms)과 이동에 걸리는 시간(ms) */
const DWELL = 700;
const MOVE = 360;

/**
 * 인트로가 끝나면 사용자가 스크롤하지 않아도 프로젝트 부분으로 내려가서
 * 프로젝트 카드를 한 장씩, 이어서 경험·활동·교육, 기술, 연락(메일)까지 차례로 보여 줍니다. (처음 한 번만, 화면 모양은 그대로)
 * 마우스 휠·터치·키보드·클릭 등 사용자가 조작하면 바로 멈추고 이후는 직접 스크롤합니다.
 * 방문자의 '동작 줄이기' 설정과 상관없이 동작합니다.
 */
export default function AutoTour() {
  useEffect(() => {
    let stopped = false;
    let started = false;
    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const stop = () => {
      stopped = true;
      cancelAnimationFrame(raf);
      if (timer) clearTimeout(timer);
      userEvents.forEach((ev) => window.removeEventListener(ev, stop));
    };
    const userEvents = ["wheel", "touchstart", "mousedown", "keydown", "pointerdown"] as const;

    const headerH = () => {
      const h = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h"));
      return Number.isFinite(h) ? h : 68;
    };

    /** 카드가 쌓이는 자리(위쪽 여백)에 맞춰 이동할 스크롤 위치를 구합니다 */
    const positions = (): number[] => {
      const list: number[] = [];
      const section = document.getElementById("projects");
      if (!section) return list;
      list.push(section.getBoundingClientRect().top + window.scrollY - headerH() - 8);
      const stacked = window.innerWidth > 860;
      document.querySelectorAll<HTMLElement>(".pcard").forEach((c, i) => {
        const stackTop = headerH() + 14 + (stacked ? i * 14 : 0);
        list.push(c.getBoundingClientRect().top + window.scrollY - stackTop);
      });
      // 카드 다음에는 경험·활동·교육, 기술, 연락(메일) 순서로 계속 내려갑니다
      ["about", "skills", "contact"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) list.push(el.getBoundingClientRect().top + window.scrollY - headerH() - 8);
      });
      return list;
    };

    const moveTo = (y: number, done: () => void) => {
      const from = window.scrollY;
      const dist = y - from;
      if (Math.abs(dist) < 2) return done();
      const t0 = performance.now();
      const step = (now: number) => {
        if (stopped) return;
        const p = Math.min(1, (now - t0) / MOVE);
        const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        window.scrollTo({ top: from + dist * e, behavior: "instant" as ScrollBehavior });
        if (p < 1) raf = requestAnimationFrame(step);
        else done();
      };
      raf = requestAnimationFrame(step);
    };

    const run = () => {
      if (started || stopped) return;
      started = true;
      // 주소에 #이 있거나 이미 아래로 내려와 있으면 건드리지 않습니다
      if (window.location.hash || window.scrollY > 120) return;
      userEvents.forEach((ev) => window.addEventListener(ev, stop, { passive: true }));
      const go = (i: number) => {
        if (stopped) return;
        const list = positions();
        if (i >= list.length) return stop();
        moveTo(list[i], () => {
          timer = setTimeout(() => go(i + 1), DWELL);
        });
      };
      timer = setTimeout(() => go(0), 700);
    };

    window.addEventListener(INTRO_DONE_EVENT, run);
    return () => {
      window.removeEventListener(INTRO_DONE_EVENT, run);
      stop();
    };
  }, []);

  return null;
}
