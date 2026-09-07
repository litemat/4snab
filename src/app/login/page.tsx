import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/warehouse-session";
import { Brand } from "../ui/Brand";
import { AccessForm } from "../ui/AccessForm";

export default async function LoginPage() {
  if (await getSessionUser()) redirect("/cabinet");
  return <main className="login-page"><Brand /><div className="login-content"><div className="eyebrow-pill"><span className="signal" /> Рабочее место склада</div><h1>Ваш ключ.<br /><span>Ваш кабинет.</span></h1><p>Введите ключ, который выдал администратор.<br />Заявки и документы уже ждут вас внутри.</p><AccessForm /></div><footer>4СНАБ · Заявки, материалы и накладные</footer></main>;
}
