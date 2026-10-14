"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Shot = { src: string; alt: string };

/**
 * 자세히 보기의 앱 화면 갤러리.
 * 스크롤바 없이 양옆 화살표로 넘기고, 2.6초마다 자동으로 옆으로 움직입니다.
 * 마우스를 올리거나 터치하면 멈추고, '동작 줄이기' 설정이면 자동 이동을 하지 않습니다.
 */
export default function AutoGallery({ images, label }: { images: Shot[]; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const [active, setActive] = useState(0);

  const anim = useRef(0);
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
      const d = Math.abs((c as HTMLElement).offsetLeft - el.offsetLeft - el.scrollLeft);
      if (d < min) {
        min = d;
        k = i;
      }
    });
    return k;
  }, []);

  const show = useCallback((i: number) => {
    const el = track.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (el && child) slideTo(child.offsetLeft - el.offsetLeft);
  }, [slideTo]);

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
    setActive(atEnd() ? images.length - 1 : current());
  }, [atEnd, current, images.length]);

  useEffect(() => {
    sync();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!paused.current) next();
    }, 2600);
    return () => clearInterval(id);
  }, [next, sync]);

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
      <button type="button" className="garrow prev" onClick={prev} aria-label="이전 화면">
        ‹
      </button>
      <div className="gal" ref={track} onScroll={sync}>
        {images.map((m) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={m.src} src={m.src} alt={m.alt} />
        ))}
      </div>
      <button type="button" className="garrow next" onClick={next} aria-label="다음 화면">
        ›
      </button>
      <div className="gdots" aria-hidden="true">
        {images.map((m, i) => (
          <i key={m.src} className={i === active ? "on" : undefined} />
        ))}
      </div>
    </div>
  );
}
