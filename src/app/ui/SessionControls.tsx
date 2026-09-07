"use client";

import { useEffect, useRef, useState } from "react";
import { logoutAction, renewSessionAction } from "../login/actions";

export function SessionControls() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Refresh existing short sessions too. Background renewal never signs the user out.
    const renew = () => { if (document.visibilityState === "visible") void renewSessionAction().catch(() => {}); };
    renew();
    const interval = window.setInterval(renew, 60 * 60 * 1000);
    document.addEventListener("visibilitychange", renew);
    return () => { window.clearInterval(interval); document.removeEventListener("visibilitychange", renew); };
  }, []);

  return <>
    <button type="button" onClick={() => { setError(""); dialog.current?.showModal(); }}>Выйти ↗</button>
    <dialog ref={dialog} className="confirmation-dialog" aria-labelledby="logout-title" onCancel={event => { if (pending) event.preventDefault(); }}>
      <span className="overline">ВЫХОД ИЗ КАБИНЕТА</span>
      <h2 id="logout-title">Вы хотите выйти?</h2>
      <p>Вход сохраняется на этом устройстве. Если выйти, для следующего входа понадобится ключ.</p>
      {error && <p role="alert">{error}</p>}
      <div className="confirmation-actions">
        <button type="button" autoFocus disabled={pending} onClick={() => dialog.current?.close()}>Остаться в кабинете</button>
        <button type="button" disabled={pending} onClick={async () => {
          setPending(true);
          try { await logoutAction(); } catch { setError("Не удалось выйти. Попробуйте ещё раз."); setPending(false); }
        }}>{pending ? "Выходим…" : "Да, выйти"}</button>
      </div>
    </dialog>
  </>;
}
