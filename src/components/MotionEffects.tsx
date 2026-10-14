"use client";

import { useEffect } from "react";

/**
 * 화면 전체에 쓰는 움직임 효과 (화면에 그리는 것은 없고 동작만 붙입니다)
 * - 맨 위 스크롤 진행 바
 * - 프로젝트 카드가 쌓일 때 앞 카드가 살짝 작아지고 어두워짐
 * - 섹션 제목·내용이 스크롤하면 부드럽게 등장 (.reveal-on-scroll)
 * - 마우스 커서가 링크·버튼 위에서 커짐
 * '동작 줄이기' 설정이 켜져 있으면 모두 건너뜁니다.
 */
export default function MotionEffects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    const bar = document.getElementById("scroll-progress");

    const onScroll = () => {
      if (bar) {
        const max = root.scrollHeight - root.clientHeight;
        bar.style.transform = `scaleX(${max > 0 ? root.scrollTop / max : 0})`;
      }
      if (reduce || window.innerWidth <= 860) return;
      const cards = Array.from(document.querySelectorAll<HTMLElement>(".pcard"));
      cards.forEach((c, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const d = next.getBoundingClientRect().top - c.getBoundingClientRect().top;
        const t = Math.max(0, Math.min(1, 1 - d / (c.offsetHeight * 0.9)));
        c.style.transform = `scale(${1 - t * 0.05})`;
        c.style.filter = `brightness(${1 - t * 0.08})`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    let io: IntersectionObserver | null = null;
    if (!reduce) {
      root.classList.add("motion");
      io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              io?.unobserve(e.target);
            }
          }),
        { threshold: 0.12 },
      );
      document.querySelectorAll(".reveal-on-scroll").forEach((el) => io!.observe(el));
    }

    let raf = 0;
    const cur = document.getElementById("cursor-dot");
    const fine = window.matchMedia("(pointer: fine)").matches;
    let onMove: ((e: MouseEvent) => void) | null = null;
    let onOver: ((e: MouseEvent) => void) | null = null;
    if (cur && fine && !reduce) {
      let cx = 0;
      let cy = 0;
      let tx = 0;
      let ty = 0;
      onMove = (e) => {
        tx = e.clientX;
        ty = e.clientY;
        cur.dataset.on = "1";
      };
      onOver = (e) => {
        const hit = (e.target as HTMLElement | null)?.closest("a, button, .pcard-phone");
        cur.dataset.big = hit ? "1" : "";
      };
      const loop = () => {
        cx += (tx - cx) * 0.2;
        cy += (ty - cy) * 0.2;
        cur.style.left = `${cx}px`;
        cur.style.top = `${cy}px`;
        raf = requestAnimationFrame(loop);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseover", onOver);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (onMove) window.removeEventListener("mousemove", onMove);
      if (onOver) window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
      io?.disconnect();
      root.classList.remove("motion");
    };
  }, []);

  return (
    <>
      <div id="scroll-progress" aria-hidden="true" />
      <div id="cursor-dot" aria-hidden="true" />
    </>
  );
}
