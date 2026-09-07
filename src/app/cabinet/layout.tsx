import Link from "next/link";
import { requireSessionUser } from "@/lib/warehouse-session";
import { Brand } from "../ui/Brand";
import { SessionControls } from "../ui/SessionControls";

export default async function CabinetLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSessionUser();
  return <div className="warehouse"><header className="workspace-header"><Brand /><Link href="/cabinet" className="workspace-label">МОЙ КАБИНЕТ</Link><div className="cabinet-account"><span className="account-avatar">{user.name.slice(0, 1).toUpperCase()}</span><span>{user.name}</span><SessionControls /></div></header>{children}<footer className="workspace-footer">4СНАБ <span>Заявки · Материалы · Накладные</span></footer></div>;
}
