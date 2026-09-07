import Link from "next/link";
import { RefreshButton } from "./RefreshButton";
import { notFound } from "next/navigation";
import { getUserByToken } from "@/lib/auth";
import { formatDate, formatMoney } from "@/lib/format";
import { countRequests, listRequests, type ShipmentRequest } from "@/lib/requests";

export const dynamic = "force-dynamic";

function MaterialsSummary({ request }: { request: ShipmentRequest }) {
  const shown = request.materials.slice(0, 2);
  const rest = request.materials.length - shown.length;
  if (!shown.length) return <span className="text-red-600">материал не указан</span>;
  return (
    <span>
      {shown.map((material) => material.name).join(", ")}
      {rest > 0 && ` +${rest}`}
    </span>
  );
}

function RequestCard({ request, basePath }: { request: ShipmentRequest; basePath: string }) {
  return (
    <Link
      href={`${basePath}/${request.id}`}
      className="shipment-card block rounded-xl border bg-white p-4 transition hover:border-gray-400 hover:shadow-sm active:bg-gray-50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="request-card-id">№ {request.id} <span>{request.isDone ? "Завершена" : "К отгрузке"}</span></div>
          <div className="truncate font-medium">{request.company ?? request.name}</div>
          <div className="mt-1 truncate text-sm text-gray-600">
            <MaterialsSummary request={request} />
          </div>
        </div>
        <span className="shrink-0 text-sm text-gray-500">
          {formatDate(request.shipDate)}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-3 text-xs text-gray-500">
        <span>
          План: <strong className="font-medium text-gray-800">{request.planQuantity ?? "—"}</strong>
        </span>
        {request.budget !== null && <span>Итог: {formatMoney(request.budget)}</span>}
        {request.draft.status === "completing" && (
          <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-800">
            повторить передачу
          </span>
        )}
        {request.syncIssue && (
          <span className="rounded bg-red-100 px-2 py-0.5 text-red-700">
            нет связи с диспетчером
          </span>
        )}
        {request.isDone && request.draft.completedAt && (
          <span>
            Завершено: {new Date(request.draft.completedAt).toLocaleString("ru-RU", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    </Link>
  );
}

export default async function RequestsListPage({
  params,
  searchParams,
  basePath: suppliedBasePath,
}: {
  basePath?: string;
  params: Promise<{ token: string }>;
  searchParams: Promise<{ view?: string | string[]; completed?: string | string[]; q?: string | string[] }>;
}) {
  const { token } = await params;
  const query = await searchParams;
  const basePath = suppliedBasePath ?? `/s/${token}`;
  const user = getUserByToken(token);
  if (!user) notFound();

  const historySelected = query.view === "history";
  const completed = query.completed === "1";
  const [requests, otherCount] = await Promise.all([
    listRequests(user.name, { scope: historySelected ? "done" : "open" }),
    countRequests(historySelected ? "open" : "done").catch(() => 0),
  ]);
  const openCount = historySelected ? otherCount : requests.length;
  const doneCount = historySelected ? requests.length : otherCount;
  const search = typeof query.q === "string" ? query.q.trim() : "";
  const needle = search.toLocaleLowerCase("ru");
  const visible = requests.filter(request => [String(request.id), request.company, request.name, ...request.materials.map(material => material.name)].filter(Boolean).join(" ").toLocaleLowerCase("ru").includes(needle));

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <header className="mb-6 cabinet-heading">
        <div className="overline">ОБЗОР СКЛАДА / {user.name}</div>
        <h1 className="text-2xl font-semibold">Заявки на отгрузку</h1>
        <p className="text-sm text-gray-500">От задания диспетчера до готовой отгрузки. Все заявки здесь.</p>
      </header>

      <div className="request-summary" aria-label="Сводка заявок">
        <div><small>Ожидают отгрузки</small><strong>{String(openCount).padStart(2, "0")}</strong></div>
        <div><small>Завершённые заявки</small><strong>{String(doneCount).padStart(2, "0")}</strong></div>
      </div>
      <nav className="mb-5 grid grid-cols-2 rounded-xl bg-gray-100 p-1" aria-label="Заявки">
        <Link
          href={basePath}
          className={`rounded-lg px-3 py-2 text-center text-sm font-medium transition ${
            !historySelected ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          В работе ({openCount})
        </Link>
        <Link
          href={`${basePath}?view=history`}
          className={`rounded-lg px-3 py-2 text-center text-sm font-medium transition ${
            historySelected ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          История ({doneCount})
        </Link>
      </nav>

      {completed && !historySelected && (
        <p className="mb-5 rounded-xl bg-green-50 p-4 text-sm text-green-800">
          Заявка завершена и передана диспетчеру. Она перемещена в историю.
        </p>
      )}

      <form action={basePath} className="request-search">
        {historySelected && <input type="hidden" name="view" value="history" />}
        <label htmlFor="request-search" className="sr-only">Поиск заявок</label>
        <input id="request-search" name="q" defaultValue={search} placeholder="Номер заявки, объект или материал" type="search" />
        <button type="submit">Найти ↗</button>
        {search && <Link href={`${basePath}${historySelected ? "?view=history" : ""}`}>Сбросить</Link>}
        <RefreshButton />
      </form>
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          {historySelected ? "Завершённые заявки" : "Текущие заявки"}
        </h2>
        {visible.length === 0 ? (
          <div className="rounded-xl border border-dashed px-5 py-10 text-center">
            <div className="text-3xl" aria-hidden="true">
              {historySelected ? "▤" : "✓"}
            </div>
            <p className="mt-3 font-medium text-gray-700">
              {search ? "По вашему запросу ничего не найдено" : historySelected ? "История пока пуста" : "Всё готово. Активных заявок нет"}
            </p>
            <p className="mt-1 text-sm text-gray-400">
              {search ? "Попробуйте другой номер, объект или название материала" : historySelected
                ? "Завершённые складом заявки появятся здесь"
                : "Нажмите «Обновить» после отправки новой заявки диспетчером"}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {visible.map((request) => (
              <li key={request.id}>
                <RequestCard request={request} basePath={basePath} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
