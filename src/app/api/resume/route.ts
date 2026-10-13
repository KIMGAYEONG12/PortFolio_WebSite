import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

// 이력서 PDF는 public/resume.pdf 한 개로 관리합니다.
// 파일을 쓰는 건 내 컴퓨터의 개발 서버(npm run dev)에서만 가능하고, 배포 사이트에서는 막혀 있습니다.
export const dynamic = "force-dynamic";

const MAX_BYTES = 10 * 1024 * 1024;
const FILE = path.join(process.cwd(), "public", "resume.pdf");

const blocked = () =>
  NextResponse.json({ error: "배포 사이트에서는 올릴 수 없어요. 내 컴퓨터(localhost)에서 올려 주세요." }, { status: 403 });

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") return blocked();
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "파일이 없어요." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "10MB 이하 PDF만 올릴 수 있어요." }, { status: 413 });
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.subarray(0, 5).toString("latin1") !== "%PDF-") {
    return NextResponse.json({ error: "PDF 파일만 올릴 수 있어요." }, { status: 400 });
  }
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, buf);
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  if (process.env.NODE_ENV !== "development") return blocked();
  await unlink(FILE).catch(() => undefined);
  return NextResponse.json({ ok: true });
}
