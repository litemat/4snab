"use client";

import { useActionState, useState } from "react";
import { loginAction } from "../login/actions";

export function AccessForm() {
  const [state, action, pending] = useActionState(loginAction, { error: "" });
  const [visible, setVisible] = useState(false);
  return (
    <form className="access-form" action={action}>
      <label htmlFor="access-code">Введите ваш ключ</label>
      <p>Ключ доступа выдан администратором склада</p>
      <div className="key-input">
        <input id="access-code" name="access" type={visible ? "text" : "password"} required maxLength={256} autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder="Ваш ключ доступа" aria-invalid={Boolean(state.error)} aria-describedby={state.error ? "access-error" : undefined} />
        <button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? "Скрыть ключ" : "Показать ключ"} aria-pressed={visible}>{visible ? "Скрыть" : "Показать"}</button>
      </div>
      {state.error && <p id="access-error" role="alert" className="access-error">{state.error}</p>}
      <button className="button-primary" type="submit" disabled={pending}>{pending ? "Проверяем ключ…" : "Войти в кабинет"}<span aria-hidden="true">↗</span></button>
      <small>Нет ключа? Обратитесь к администратору.</small>
    </form>
  );
}
