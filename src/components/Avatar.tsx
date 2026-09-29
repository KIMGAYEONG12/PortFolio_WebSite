import type { CSSProperties } from "react";

type Props = {
  photo: string;
  name: string;
  /** 숫자(px) 또는 CSS 길이값 (예: "clamp(140px, 22vw, 280px)") */
  size?: number | string;
  className?: string;
};

export default function Avatar({ photo, name, size = 40, className = "" }: Props) {
  const initial = name.trim().charAt(0) || "?";
  const style = { "--size": typeof size === "number" ? `${size}px` : size } as CSSProperties;

  return (
    <span className={`avatar ${className}`.trim()} style={style}>
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt={`${name} 프로필 사진`} />
      ) : (
        <span aria-hidden="true">{initial}</span>
      )}
    </span>
  );
}
