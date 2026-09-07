import { Brand } from "@/app/ui/Brand";

export default async function WarehouseLayout({ children, params }: { children: React.ReactNode; params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <div className="warehouse"><div className="workspace-header"><Brand href={`/s/${encodeURIComponent(token)}`} /><span className="workspace-label">РАБОЧЕЕ МЕСТО СКЛАДА</span><span className="workspace-private">Персональный доступ ↗</span></div>{children}<footer className="workspace-footer">4СНАБ <span>Заявки · Материалы · Накладные</span></footer></div>;
}
