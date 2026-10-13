"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "./Icons";

type Shot = { src: string; alt: string };

/**
 * 모바일 앱 화면을 슬라이드로 보여 준다.
 * - 화살표 버튼이나 손가락·마우스 휠(가로 스크롤)로 넘긴다.
 * - 그림을 누르면 원본 크기로 크게 보이고, 좌우 화살표 키로 이어서 넘길 수 있다.
 */
export default function ShotCarousel({ images, label }: { images: Shot[]; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const [open, setOpen] = useState<number | null>(null);

  const syncEdge = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft <= 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
  }, []);

  useEffect(() => {
    syncEdge();
    window.addEventListener("resize", syncEdge);
    return () => window.removeEventListener("resize", syncEdge);
  }, [syncEdge, images.length]);

  function page(dir: 1 | -1) {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  }

  const step = useCallback(
    (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, step]);

  return (
    <div className="shot-carousel" role="group" aria-label={label}>
      <div className="shot-stage">
        <div className="shot-track" ref={track} onScroll={syncEdge}>
          {images.map((img, i) => (
            <button
              key={`${i}-${img.src}`}
              type="button"
              className="shot-slide"
              onClick={() => setOpen(i)}
              aria-label={`${img.alt} 크게 보기`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} loading={i < 4 ? "eager" : "lazy"} decoding="async" className="shot-mobile" />
            </button>
          ))}
        </div>
        <button type="button" className="shot-arrow is-prev" onClick={() => page(-1)} disabled={edge.start} aria-label="이전 화면">
          <ArrowLeftIcon size={14} />
        </button>
        <button type="button" className="shot-arrow is-next" onClick={() => page(1)} disabled={edge.end} aria-label="다음 화면">
          <ArrowRightIcon size={14} />
        </button>
      </div>
      <p className="shot-count">{images.length}장 · 눌러서 크게 보기</p>

      {open !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={images[open].alt} onClick={() => setOpen(null)}>
          <button type="button" className="lightbox-close" onClick={() => setOpen(null)} aria-label="닫기">
            <CloseIcon />
          </button>
          <button
            type="button"
            className="lightbox-arrow is-prev"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="이전 화면"
          >
            <ArrowLeftIcon size={22} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lightbox-img" src={images[open].src} alt={images[open].alt} onClick={(e) => e.stopPropagation()} />
          <button
            type="button"
            className="lightbox-arrow is-next"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="다음 화면"
          >
            <ArrowRightIcon size={22} />
          </button>
          <p className="lightbox-cap" onClick={(e) => e.stopPropagation()}>
            {open + 1} / {images.length} · {images[open].alt}
          </p>
        </div>
      )}
    </div>
  );
}
