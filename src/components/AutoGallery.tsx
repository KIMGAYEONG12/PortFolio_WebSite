"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Shot = { src: string; alt: string };

const padLeft = (el: HTMLElement) => parseFloat(getComputedStyle(el).paddingLeft) || 0;

/**
 * 자세히 보기의 앱 화면 갤러리.
 * 스크롤바 없이 양옆 화살표로 넘기고, 2.6초마다 자동으로 옆으로 움직입니다.
 * 마우스를 올리거나 터치하면 멈추고, '동작 줄이기' 설정이면 자동 이동을 하지 않습니다.
 * 화면이 한 줄에 다 들어가서 넘길 게 없으면 화살표와 점을 숨깁니다.
 * 화살표는 모든 프로젝트에서 같은 자리(그림 높이의 가운데, 양쪽 끝)에 놓입니다.
 */
export default function AutoGallery({ images, label }: { images: Shot[]; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const anim = useRef(0);
  const [active, setActive] = useState(0);
  const [scrollable, setScrollable] = useState(false);

  /** 브라우저의 smooth 스크롤 대신 직접 그려서, 어떤 환경에서도 똑같이 부드럽게 움직입니다. */
  const slideTo = useCallback((left: number) => {
    const el = track.current;
    if (!el) return;
    cancelAnimationFrame(anim.current);
    const from = el.scrollLeft;
    const dist = left - from;
    if (Math.abs(dist) < 1) return;
    const t0 = performance.now();
    const dur = 650;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.scrollLeft = from + dist * e;
      if (p < 1) anim.current = requestAnimationFrame(step);
    };
    anim.current = requestAnimationFrame(step);
  }, []);

  const atEnd = useCallback(() => {
    const el = track.current;
    return !!el && el.scrollLeft + el.clientWidth >= el.scrollWidth - 6;
  }, []);

  const current = useCallback(() => {
    const el = track.current;
    if (!el) return 0;
    let k = 0;
    let min = Infinity;
    Array.from(el.children).forEach((c, i) => {
      const d = Math.abs((c as HTMLElement).offsetLeft - el.offsetLeft - padLeft(el) - el.scrollLeft);
      if (d < min) {
        min = d;
        k = i;
      }
    });
    return k;
  }, []);

  const show = useCallback(
    (i: number) => {
      const el = track.current;
      const child = el?.children[i] as HTMLElement | undefined;
      // 그림이 항상 갤러리 왼쪽 여백만큼 안쪽에 오도록 맞춰서, 왼쪽 화살표와의 간격이 어느 장에서나 같습니다
      if (el && child) slideTo(child.offsetLeft - el.offsetLeft - padLeft(el));
    },
    [slideTo],
  );

  const next = useCallback(() => {
    const el = track.current;
    if (!el) return;
    if (atEnd()) slideTo(0);
    else show(Math.min(current() + 1, images.length - 1));
  }, [atEnd, current, images.length, show, slideTo]);

  const prev = useCallback(() => {
    const el = track.current;
    if (!el) return;
    if (el.scrollLeft <= 4) slideTo(el.scrollWidth);
    else show(Math.max(current() - 1, 0));
  }, [current, show, slideTo]);

  const sync = useCallback(() => {
    const el = track.current;
    if (el) setScrollable(el.scrollWidth > el.clientWidth + 2);
    setActive(atEnd() ? images.length - 1 : current());
  }, [atEnd, current, images.length]);

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!paused.current) next();
    }, 2600);
    return () => clearInterval(id);
  }, [next]);

  if (images.length === 0) return null;
  const hold = () => {
    paused.current = true;
  };
  const release = () => {
    paused.current = false;
  };

  return (
    <div
      className="gwrap"
      role="region"
      aria-label={label}
      onMouseEnter={hold}
      onMouseLeave={release}
      onFocus={hold}
      onBlur={release}
      onTouchStart={hold}
      onTouchEnd={release}
    >
      <div className="gal" ref={track} onScroll={sync}>
        {images.map((m) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={m.src} src={m.src} alt={m.alt} onLoad={sync} />
        ))}
      </div>
      {scrollable && (
        <>
          <div className="garrows">
            <button type="button" className="garrow prev" onClick={prev} aria-label="이전 화면">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button type="button" className="garrow next" onClick={next} aria-label="다음 화면">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="gdots" aria-hidden="true">
            {images.map((m, i) => (
              <i key={m.src} className={i === active ? "on" : undefined} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
