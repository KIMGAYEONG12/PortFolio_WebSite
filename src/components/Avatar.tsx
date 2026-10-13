import type { CSSProperties } from "react";

type Props = {
  photo: string;
  name: string;
  /** 숫자(px) 또는 CSS 길이값 (예: "clamp(140px, 22vw, 280px)") */
  size?: number | string;
  className?: string;
  /** 사진에서 보일 중심 위치(0~100, 가운데가 50)와 크기(%, 100이면 동그라미 폭에 꽉 참) */
  x?: number;
  y?: number;
  zoom?: number;
};

/** public/profile.jpg 의 뒷배경(회색 벽)·정장 색. 사진을 줄였을 때 비는 가장자리를 같은 색으로 채워 티가 나지 않게 한다. */
const DEFAULT_PHOTO = "/profile.jpg";
const WALL_RATIO = 472 / 354; // 사진의 세로/가로
const WALL: [number, string][] = [
  [0, "#a0a0a0"],
  [60, "#acacac"],
  [120, "#b5b5b5"],
  [180, "#b9b9b9"],
  [240, "#bbbbbd"],
  [346, "#bbbbbd"],
  [354, "#1c1c1e"], // 사진 아래쪽 정장이 시작하는 높이 — 줄였을 때 비는 양옆도 정장 색으로 이어 준다
  [472, "#1c1c1e"],
];

function wallGradient(zoom: number, y: number): string {
  const imgH = (zoom / 100) * WALL_RATIO; // 동그라미 높이를 1로 봤을 때 사진 높이
  const top = (1 - imgH) * (y / 100); // 사진 윗변의 위치
  const stops = WALL.map(([py, color]) => `${color} ${((top + (py / 472) * imgH) * 100).toFixed(1)}%`);
  return `linear-gradient(to bottom, ${stops.join(", ")})`;
}

export default function Avatar({ photo, name, size = 40, className = "", x = 50, y = 50, zoom = 100 }: Props) {
  const style = { "--size": typeof size === "number" ? `${size}px` : size } as CSSProperties;
  const wall = photo === DEFAULT_PHOTO && zoom < 100 ? wallGradient(zoom, y) : "";

  // 사진은 자르지 않고 배경 그림으로 그려서, 크기·위치를 바꿔도 전체가 그대로 이어지게 한다.
  const photoStyle: CSSProperties = {
    backgroundImage: `url("${photo}")${wall ? `, ${wall}` : ""}`,
    backgroundSize: `${zoom}% auto${wall ? ", 100% 100%" : ""}`,
    backgroundPosition: `${x}% ${y}%${wall ? ", 0 0" : ""}`,
    backgroundRepeat: "no-repeat",
  };

  return (
    <span className={`avatar ${photo ? "has-photo " : ""}${className}`.trim()} style={style}>
      {photo ? (
        <span className="avatar-photo" role="img" aria-label={`${name} 프로필 사진`} style={photoStyle} />
      ) : (
        // 사진이 없으면 글자 없이 기본 사람 모양만 보여줍니다.
        <svg className="avatar-silhouette" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="8.5" r="4.2" />
          <path d="M3.5 21c0-4.7 3.8-7.6 8.5-7.6s8.5 2.9 8.5 7.6z" />
        </svg>
      )}
    </span>
  );
}
