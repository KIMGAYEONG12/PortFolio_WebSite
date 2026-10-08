"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CloseIcon } from "./Icons";

type Props = { to: string; ownerName: string; onClose: () => void };
type Status = "idle" | "sending" | "sent" | "error";

/** Gmail의 "편지 쓰기" 창처럼 화면 오른쪽 아래에 뜨는 메일 작성 창 */
export default function ComposeMail({ to, ownerName, onClose }: Props) {
  const [from, setFrom] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honey, setHoney] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const fromRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fromRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    if (!/^\S+@\S+\.\S+$/.test(from.trim())) {
      setError("답장 받을 이메일 주소를 확인해 주세요.");
      return;
    }
    if (!message.trim()) {
      setError("내용을 입력해 주세요.");
      return;
    }
    setError("");
    setStatus("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: subject.trim() || `[포트폴리오] ${from.trim()}님이 보낸 메일`,
          _replyto: from.trim(),
          _template: "table",
          _honey: honey,
          email: from.trim(),
          message: message.trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: string | boolean };
      if (!res.ok || String(data.success) === "false") throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("전송에 실패했어요. 잠시 뒤 다시 시도해 주세요.");
    }
  }

  return (
    <div className="compose" role="dialog" aria-label="새 메일 작성">
      <div className="compose-head">
        <span className="compose-title">새 메일</span>
        <button type="button" className="compose-close" onClick={onClose} aria-label="닫기">
          <CloseIcon />
        </button>
      </div>

      {status === "sent" ? (
        <div className="compose-done">
          <p className="compose-done-title">메일을 보냈어요</p>
          <p className="muted">{ownerName}에게 전달됐어요. 확인 후 답장 드릴게요.</p>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            닫기
          </button>
        </div>
      ) : (
        <form className="compose-form" onSubmit={submit} noValidate>
          <label className="compose-row">
            <span>받는 사람</span>
            <input value={`${ownerName} <${to}>`} readOnly tabIndex={-1} />
          </label>
          <label className="compose-row">
            <span>보내는 사람</span>
            <input
              ref={fromRef}
              type="email"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="답장 받을 내 이메일"
              autoComplete="email"
            />
          </label>
          <label className="compose-row">
            <span>제목</span>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="제목" maxLength={120} />
          </label>
          <input
            className="visually-hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={honey}
            onChange={(e) => setHoney(e.target.value)}
            name="_honey"
          />
          <textarea
            className="compose-body"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="내용을 입력하세요"
            maxLength={5000}
            aria-label="내용"
          />
          <div className="compose-foot">
            <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
              {status === "sending" ? "보내는 중…" : "보내기"}
            </button>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
