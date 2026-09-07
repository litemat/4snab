import { Brand } from "@/app/ui/Brand";

export default function WarehouseLayout({ children }: { children: React.ReactNode }) {
  return <div className="warehouse"><div className="workspace-header"><Brand /><span className="workspace-label">РАБОЧЕЕ МЕСТО СКЛАДА</span><span className="workspace-private">Персональный доступ ↗</span></div>{children}<footer className="workspace-footer">4СНАБ <span>Заявки · Материалы · Накладные</span></footer></div>;
}
