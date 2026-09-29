/**
 * 이미지 파일을 캔버스로 줄여서 JPEG data URL로 돌려줍니다.
 * (localStorage 용량을 아끼기 위해 크기를 제한합니다.)
 */
export function fileToResizedDataUrl(
  file: File,
  opts: { max: number; square?: boolean; quality?: number }
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("이미지 파일만 올릴 수 있어요."));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      let sx = 0;
      let sy = 0;
      let sw = img.naturalWidth;
      let sh = img.naturalHeight;
      let dw: number;
      let dh: number;

      if (opts.square) {
        const s = Math.min(sw, sh);
        sx = (sw - s) / 2;
        sy = (sh - s) / 2;
        sw = s;
        sh = s;
        dw = dh = Math.min(opts.max, s);
      } else {
        const scale = Math.min(1, opts.max / Math.max(sw, sh));
        dw = Math.max(1, Math.round(sw * scale));
        dh = Math.max(1, Math.round(sh * scale));
      }

      const canvas = document.createElement("canvas");
      canvas.width = dw;
      canvas.height = dh;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("이미지를 처리할 수 없어요."));
        return;
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, dw, dh);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);
      resolve(canvas.toDataURL("image/jpeg", opts.quality ?? 0.85));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이 이미지 형식은 열 수 없어요. JPG·PNG 파일을 사용해 주세요."));
    };

    img.src = url;
  });
}
