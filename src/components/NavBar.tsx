"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ButtonLink } from "./ui";

const tabs = [
  { href: "/feed", label: "Feed" },
  { href: "/friends", label: "Friends" },
  { href: "/friends/add", label: "Add" },
  { href: "/me", label: "Me" },
];

// Mobile first: on a phone the tabs sit in a bar at the bottom, where a thumb
// reaches them. From the sm breakpoint up they move into the top bar. Either
// way the current page is marked in red and with aria-current.
export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-ink bg-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-30 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-2xl items-center gap-6 px-4 py-2">
        <Link href="/" className="mr-auto py-1 text-2xl font-bold tracking-tight">
          Kinnect<span className="text-accent">.</span>
        </Link>
        <nav
          aria-label="Main"
          className="fixed inset-x-0 bottom-0 border-t border-ink bg-paper pb-[env(safe-area-inset-bottom)] sm:static sm:border-0 sm:pb-0"
        >
          <ul className="mx-auto flex max-w-2xl sm:gap-5">
            {tabs.map(({ href, label }) => {
              const current = pathname === href;
              return (
                <li key={href} className="flex-1 sm:flex-none">
                  <Link
                    href={href}
                    aria-current={current ? "page" : undefined}
                    className={`label flex min-h-14 items-center justify-center border-t-4 sm:min-h-11 sm:border-t-0 sm:border-b-2 ${
                      current ? "border-accent" : "border-transparent hover:border-ink"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <ButtonLink href="/post/new" className="px-4">
          Write
        </ButtonLink>
      </div>
    </header>
  );
}
