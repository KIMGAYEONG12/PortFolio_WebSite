"use client";

import { useState } from "react";
import Avatar from "./Avatar";
import Modal from "./Modal";
import { usePortfolio } from "./PortfolioProvider";

/** 프로필 사진의 보이는 위치(좌우·상하)와 크기를 슬라이더로 직접 조절하는 창 */
export default function PhotoAdjust({ onClose }: { onClose: () => void }) {
  const { profile, updateProfile, toast } = usePortfolio();
  const [x, setX] = useState(profile.photoX);
  const [y, setY] = useState(profile.photoY);
  const [zoom, setZoom] = useState(profile.photoZoom);

  const snippet = `photoX: ${x},\nphotoY: ${y},\nphotoZoom: ${zoom},`;

  function save() {
    updateProfile({ photoX: x, photoY: y, photoZoom: zoom });
    toast("사진 위치를 저장했어요");
    onClose();
  }

  function reset() {
    setX(50);
    setY(50);
    setZoom(100);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      toast("값을 복사했어요");
    } catch {
      toast("복사하지 못했어요. 아래 값을 직접 적어 주세요");
    }
  }

  return (
    <Modal
      title="프로필 사진 위치 조절"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn" onClick={reset}>
            처음 값으로
          </button>
          <button type="button" className="btn" onClick={onClose}>
            취소
          </button>
          <button type="button" className="btn btn-primary" onClick={save}>
            저장
          </button>
        </>
      }
    >
      <div className="photo-adjust">
        <div className="photo-adjust-preview">
          <Avatar photo={profile.photo} name={profile.name} size={200} x={x} y={y} zoom={zoom} />
        </div>

        <div className="photo-adjust-controls">
          <label className="field">
            <span className="field-label">좌우 위치 ({x})</span>
            <input type="range" min={0} max={100} value={x} onChange={(e) => setX(Number(e.target.value))} />
          </label>
          <label className="field">
            <span className="field-label">상하 위치 ({y})</span>
            <input type="range" min={0} max={100} value={y} onChange={(e) => setY(Number(e.target.value))} />
          </label>
          <label className="field">
            <span className="field-label">크기 ({zoom}%)</span>
            <input type="range" min={70} max={250} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
          </label>
          <p className="muted photo-adjust-note">
            크기를 100% 아래로 줄이면 사진 둘레에 회색 배경이 보여요. 사진은 원본 그대로이고, 보이는 부분만 바뀌어요.
          </p>
        </div>

        <div className="photo-adjust-deploy">
          <p className="field-label">배포 사이트에도 똑같이 보이게 하려면</p>
          <p className="muted">
            <code>src/data/profile.ts</code> 파일에서 같은 이름의 값을 아래처럼 바꾸고 올리세요. (이 창은 내 컴퓨터에서만 열려요.)
          </p>
          <pre className="photo-adjust-code">{snippet}</pre>
          <button type="button" className="btn btn-sm" onClick={copy}>
            값 복사
          </button>
        </div>
      </div>
    </Modal>
  );
}
