"use client";
export default function CabinetError({ reset }: { reset: () => void }) {
  return <main className="cabinet-loading"><h1>Не удалось загрузить заявки</h1><p>Проверьте соединение и попробуйте ещё раз.</p><button className="button-primary" onClick={reset}>Повторить ↻</button></main>;
}
