"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar from "./Avatar";
import { usePortfolio } from "./PortfolioProvider";

export default function Header() {
  const { profile, ready, canEdit } = usePortfolio();
  const pathname = usePathname();
  const onMy = pathname === "/my";

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="wordmark">
          <span className="fade-swap" data-pending={!ready || undefined}>
            {profile.name}
          </span>
        </Link>
        <nav aria-label="주요 메뉴">
          <ul className="nav-list">
            {profile.navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nav-link">
                  {item.label}
                </Link>
              </li>
            ))}
            {canEdit && (
            <li>
              <Link
                href="/my"
                className={`nav-my ${onMy ? "is-active" : ""}`.trim()}
                aria-current={onMy ? "page" : undefined}
              >
                <span className="fade-swap" data-pending={!ready || undefined}>
                  <Avatar photo={profile.photo} name={profile.name} size={28} />
                </span>
                <span className="nav-my-label">MY</span>
              </Link>
            </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
