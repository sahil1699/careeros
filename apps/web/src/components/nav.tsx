"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { logout } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "🏠 Home" },
  { href: "/mission", label: "🎯 Mission" },
  { href: "/daily", label: "📅 Daily" },
  { href: "/projects", label: "💻 Projects" },
  { href: "/reviews", label: "📈 Reviews" },
  { href: "/career-wins", label: "🏆 Career Wins" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex w-56 shrink-0 flex-col gap-1 border-r p-4">
      <div className="mb-4 px-2">
        <span className="font-heading text-lg font-semibold">CareerOS</span>
      </div>
      {LINKS.map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-md px-2 py-1.5 text-sm hover:bg-accent",
              active && "bg-accent font-medium"
            )}
          >
            {link.label}
          </Link>
        );
      })}
      <div className="mt-auto pt-4">
        <form action={logout}>
          <Button variant="ghost" size="sm" type="submit" className="w-full justify-start">
            Log out
          </Button>
        </form>
      </div>
    </nav>
  );
}
