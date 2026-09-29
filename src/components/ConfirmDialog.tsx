"use client";

import Modal from "./Modal";

type Props = {
  title: string;
  message: string;
  okLabel?: string;
  danger?: boolean;
  onOk: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  title,
  message,
  okLabel = "확인",
  danger = true,
  onOk,
  onCancel,
}: Props) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button type="button" className="btn" onClick={onCancel}>
            취소
          </button>
          <button
            type="button"
            className={danger ? "btn btn-danger-solid" : "btn btn-primary"}
            onClick={onOk}
          >
            {okLabel}
          </button>
        </>
      }
    >
      <p className="confirm-message">{message}</p>
    </Modal>
  );
}
