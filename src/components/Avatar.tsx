import type { CSSProperties } from "react";

type Props = {
  photo: string;
  name: string;
  /** 숫자(px) 또는 CSS 길이값 (예: "clamp(140px, 22vw, 280px)") */
  size?: number | string;
  className?: string;
};

export default function Avatar({ photo, name, size = 40, className = "" }: Props) {
  const style = { "--size": typeof size === "number" ? `${size}px` : size } as CSSProperties;

  return (
    <span className={`avatar ${className}`.trim()} style={style}>
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt={`${name} 프로필 사진`} />
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
