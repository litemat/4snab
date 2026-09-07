import Link from "next/link";
import { Brand } from "./ui/Brand";

export default function NotFound() {
  return <main className="not-found page-width"><Brand /><span className="overline">404 / СТРАНИЦА НЕ НАЙДЕНА</span><h1>Проверим адрес<span>?</span></h1><p>Ссылка недействительна или заявка недоступна.<br />Проверьте персональный код у администратора.</p><Link className="button-primary" href="/#access">На страницу входа <span>↗</span></Link></main>;
}
