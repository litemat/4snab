"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type DeleteResult = { ok: boolean; error?: string };

export function DeleteRequest({ id, name, version, basePath, disabled, scopeDescription, deleteAction }: {
  id: number;
  name: string;
  version: number;
  basePath: string;
  disabled: boolean;
  scopeDescription: string;
  deleteAction: (data: FormData) => Promise<DeleteResult>;
}) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const busy = useRef(false);
  const [step, setStep] = useState(1);
  const [confirmation, setConfirmation] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function remove() {
    if (busy.current || step !== 2 || confirmation.trim() !== String(id)) return;
    busy.current = true;
    setPending(true);
    setError("");
    const data = new FormData();
    data.set("id", String(id));
    data.set("version", String(version));
    data.set("confirmationId", confirmation.trim());
    data.set("confirmed", "delete-permanently");
    try {
      const result = await deleteAction(data);
      if (!result.ok) { setError(result.error ?? "Не удалось удалить заявку."); return; }
      dialog.current?.close();
      router.replace(basePath);
      router.refresh();
    } catch { setError("Не удалось удалить заявку. Проверьте соединение и попробуйте ещё раз."); }
    finally { busy.current = false; setPending(false); }
  }

  return <div className="request-danger">
    <div><strong>Удаление заявки</strong><p>{disabled ? "Удаление недоступно во время передачи диспетчеру." : "Потребуются два подтверждения. Действие нельзя отменить в кабинете."}</p></div>
    <button type="button" disabled={disabled} onClick={() => {
      setStep(1); setConfirmation(""); setError(""); dialog.current?.showModal();
    }}>Удалить заявку</button>
    <dialog ref={dialog} className="confirmation-dialog" aria-labelledby="delete-title" aria-describedby="delete-description" onCancel={event => { if (pending) event.preventDefault(); }}>
      <span className="overline">ПОДТВЕРЖДЕНИЕ {step} ИЗ 2</span>
      <h2 id="delete-title">{step === 1 ? `Точно удалить заявку №${id}?` : "Восстановить заявку в кабинете будет нельзя. Вы уверены?"}</h2>
      <p className="confirmation-object"><strong>№{id} · {name}</strong></p>
      <p id="delete-description">{scopeDescription}</p>
      {step === 2 && <label>Для подтверждения введите номер заявки: <strong>{id}</strong><input inputMode="numeric" autoComplete="off" value={confirmation} disabled={pending} onChange={event => setConfirmation(event.target.value)} aria-label="Номер заявки для удаления" /></label>}
      {error && <p role="alert" className="access-error">{error}</p>}
      <div className="confirmation-actions">
        <button type="button" ref={cancel} autoFocus disabled={pending} onClick={() => dialog.current?.close()}>Отмена</button>
        {step === 1 ? <button type="button" onClick={() => { setStep(2); cancel.current?.focus(); }}>Да, продолжить</button> : <button type="button" className="danger-button" disabled={pending || confirmation.trim() !== String(id)} onClick={() => void remove()}>{pending ? "Удаляем…" : "Удалить безвозвратно"}</button>}
      </div>
    </dialog>
  </div>;
}
