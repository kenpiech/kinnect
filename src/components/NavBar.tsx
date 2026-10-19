"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ButtonLink } from "./ui";

const links = [
  { href: "/feed", label: "Feed" },
  { href: "/friends", label: "Friends" },
  { href: "/friends/add", label: "Add friend" },
  { href: "/me", label: "Me" },
];

// The same top bar on every page. The current page is underlined in red and
// marked with aria-current, so it's always clear where you are.
export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-ink bg-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-2xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="mr-auto text-2xl font-bold tracking-tight">
          Kinnect<span className="text-accent">.</span>
        </Link>
        <nav aria-label="Main" className="order-last w-full sm:order-none sm:w-auto">
          <ul className="flex gap-5">
            {links.map(({ href, label }) => {
              const current = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={current ? "page" : undefined}
                    className={`label inline-block py-2 border-b-2 ${
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
        <ButtonLink href="/post/new" className="min-h-10 px-4">
          Write a post
        </ButtonLink>
      </div>
    </header>
  );
}
