import { AccessForm } from "./ui/AccessForm";
import { Brand } from "./ui/Brand";

const features = [
  ["01", "↗", "От заявки до отгрузки", "Задание диспетчера, материалы и фактические объёмы — в одной карточке."],
  ["02", "▦", "Каждая позиция на месте", "Количество, единица измерения и закупочная цена отдельно для каждого материала."],
  ["03", "⌁", "Документы под рукой", "Прикрепляйте накладные и фотографии прямо к заявке. Все файлы — рядом с данными."],
  ["04", "✓", "Одна команда. Один процесс.", "Завершайте отгрузку и передавайте результат диспетчеру через amoCRM."],
];

export default function Home() {
  return (
    <div className="landing" id="top">
      <header className="site-header page-width">
        <Brand />
        <nav aria-label="Основная навигация"><a href="#features">Возможности</a><a href="#process">Как это работает</a></nav>
        <a className="header-login" href="/login">Войти в систему <span>↗</span></a>
      </header>
      <main>
        <section className="hero page-width">
          <div className="hero-copy">
            <div className="eyebrow-pill"><span className="signal" /> Цифровой порядок на складе</div>
            <h1>Ваш склад.<br />Всё под<br /><span>контролем.</span></h1>
            <p className="hero-description">Заявки, материалы и накладные — в одном окне. От задания диспетчера до готовой отгрузки.</p>
            <div className="hero-actions"><a href="/login" className="button-primary">Открыть рабочее место <span>↗</span></a><a className="text-link" href="#process">Как это работает <span>↓</span></a></div>
            <div className="integration"><span>В ЕДИНОМ ПРОЦЕССЕ</span><strong>Склад</strong><i>×</i><strong className="amo">amoCRM</strong></div>
          </div>
          <div className="hero-visual" aria-label="Пример интерфейса складской заявки">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="lime-sphere" />
            <div className="dashboard-preview">
              <div className="preview-top"><Brand /><span className="preview-label">РАБОЧЕЕ МЕСТО</span><span className="status-dot">Обзор</span></div>
              <div className="preview-heading"><div><span className="overline">СКЛАД / ЗАЯВКИ</span><h2>Всё готово к работе<span>.</span></h2></div><span className="preview-square">↗</span></div>
              <div className="preview-stats"><div><span>В работе</span><strong>08<small>заявок</small></strong><i>Ожидают отгрузки</i></div><div><span>Завершено</span><strong>24<small>заявки</small></strong><i>Переданы диспетчеру ↗</i></div></div>
              <div className="preview-table"><div className="preview-table-title">Текущие заявки <span>ПРИМЕР ДАННЫХ</span></div>{[["Бетон М300", "120 м³", "В работе"], ["Арматура А500", "8 тонн", "В работе"], ["Кирпич керамический", "4 800 шт.", "Готово"]].map(([name, qty, status], i) => <div className="preview-row" key={name}><span className="material-icon">{i === 1 ? "╱" : "▦"}</span><div><strong>{name}</strong><small>Заявка №{1048 - i}</small></div><span>{qty}</span><b className={i === 2 ? "ready" : ""}>{status}</b></div>)}</div>
              <div className="preview-bottom"><span className="signal" /> Заявки и документы в одном месте <span>↗</span></div>
            </div>
            <div className="floating-note"><span className="note-icon">✓</span><div><small>ОТГРУЗКА ЗАВЕРШЕНА</small><strong>Данные переданы</strong></div><span>↗</span></div>
            <div className="visual-caption">ЕДИНЫЙ ПРОЦЕСС · ОТ ЗАЯВКИ ДО РЕЗУЛЬТАТА</div>
          </div>
        </section>
        <section className="principles page-width" aria-label="Преимущества"><div><strong>01</strong><span>единое рабочее<br />пространство</span></div><div><strong>Без потерь</strong><span>материалы, объёмы<br />и документы</span></div><div><strong>↗</strong><span>прямая связь<br />с диспетчером</span></div></section>
        <section className="features-section page-width" id="features"><div className="section-heading"><div><span className="overline">МЕНЬШЕ РУТИНЫ. БОЛЬШЕ ПОРЯДКА.</span><h2>Каждая отгрузка —<br /><span>в поле зрения.</span></h2></div><p>Всё, что нужно заведующему складом.<br />В понятном интерфейсе, без лишних действий.</p></div><div className="feature-grid">{features.map(([n, icon, title, description]) => <article key={n}><div className="feature-top"><span>{icon}</span><small>{n}</small></div><h3>{title}</h3><p>{description}</p></article>)}</div></section>
        <section className="process-section page-width" id="process"><div className="section-heading"><div><span className="overline">ПРОСТОЙ РАБОЧИЙ ПРОЦЕСС</span><h2>Три шага.<br /><span>Отгрузка готова.</span></h2></div><span className="process-symbol" aria-hidden="true">↗</span></div><div className="process-grid">{[["Получите заявку", "Диспетчер отправит задание. Объект, материалы и план уже будут в карточке."], ["Заполните факт", "Укажите объёмы и цены, добавьте доставку и прикрепите накладные."], ["Передайте результат", "Завершите заявку. Данные уйдут диспетчеру, а отгрузка сохранится в истории."]].map(([title, text], i) => <article key={title}><span className="step-number">0{i + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
        <section className="access-section page-width" id="access"><div><span className="overline">ВАШЕ РАБОЧЕЕ МЕСТО</span><h2>Порядок начинается<br />с одного входа<span>.</span></h2><p>Используйте ваш персональный ключ доступа,<br />который вам выдал администратор.</p><span className="access-note">↳ Доступ только для сотрудников</span></div><AccessForm /></section>
      </main>
      <footer className="site-footer page-width"><Brand /><p>Цифровое рабочее место склада</p><span>4СНАБ · {new Date().getFullYear()}</span><a href="#top" aria-label="Наверх">↑</a></footer>
    </div>
  );
}
