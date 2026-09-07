import Link from "next/link";

export function Brand({ href = "/" }: { href?: string }) {
  return <Link href={href} className="brand" aria-label={href === "/" ? "4СНАБ — главная" : "4СНАБ — главная кабинета"}><span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path d="M17 6 7 19h13M17 6v20M24 7v12" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" /></svg></span><span>4СНАБ<span className="brand-dot">.</span></span></Link>;
}
