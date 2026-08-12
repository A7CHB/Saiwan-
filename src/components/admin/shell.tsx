"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Boxes,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  Languages,
  Menu,
  MessageSquare,
  Settings,
  Tags,
  Users,
  X,
} from "lucide-react";
import { CanopyMark } from "@/components/icons/canopy";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/translations", label: "Translations", icon: Languages },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

/**
 * Dashboard chrome: a fixed rail on desktop, a slide-over on mobile.
 *
 * The theme toggle is shared with the storefront — the admin re-declares the
 * colour tokens, so the same component drives both without a second
 * implementation.
 */
export function AdminShell({
  children,
  user,
  signOut,
}: {
  children: React.ReactNode;
  user: { name: string; email: string; role: string };
  signOut: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const nav = (
    <nav aria-label="Admin sections" className="flex flex-1 flex-col gap-0.5 p-3">
      {NAV.map((item) => {
        const active = isActive(item.href, item.exact);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150",
              active
                ? "bg-accent/10 font-medium text-accent"
                : "text-muted hover:bg-sunken hover:text-fg",
            )}
          >
            <Icon className="size-4 shrink-0" strokeWidth={1.6} aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-dvh">
      {/* Desktop rail */}
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-e border-line bg-elevated lg:flex">
        <Link href="/admin" className="flex items-center gap-2.5 border-b border-line px-5 py-4">
          <CanopyMark className="size-5 text-accent" aria-hidden="true" />
          <span className="text-sm font-semibold tracking-tight">Saiwan</span>
          <span className="ms-auto rounded bg-sunken px-1.5 py-0.5 text-[0.625rem] font-medium uppercase tracking-wide text-subtle">
            Admin
          </span>
        </Link>

        {nav}

        <div className="border-t border-line p-3">
          <div className="mb-2 px-3 py-2">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-subtle">{user.email}</p>
            <p className="mt-1.5 inline-block rounded bg-sunken px-1.5 py-0.5 text-[0.625rem] font-medium uppercase tracking-wide text-muted">
              {user.role}
            </p>
          </div>
          {signOut}
        </div>
      </aside>

      {/* Mobile slide-over */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-[rgb(var(--c-overlay)/0.5)]"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative flex h-dvh w-72 max-w-[85vw] flex-col border-e border-line bg-elevated animate-rise">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="flex items-center gap-2.5">
                <CanopyMark className="size-5 text-accent" aria-hidden="true" />
                <span className="text-sm font-semibold">Saiwan Admin</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex size-8 items-center justify-center rounded text-muted hover:bg-sunken hover:text-fg"
              >
                <X className="size-4" strokeWidth={1.6} />
              </button>
            </div>
            {nav}
            <div className="border-t border-line p-3">{signOut}</div>
          </aside>
        </div>
      ) : null}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-[rgb(var(--c-bg-elevated)/0.85)] px-4 backdrop-blur-md sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex size-9 items-center justify-center rounded text-muted transition-colors hover:bg-sunken hover:text-fg lg:hidden"
          >
            <Menu className="size-4.5" strokeWidth={1.6} />
          </button>

          <span className="text-sm font-medium">
            {NAV.find((item) => isActive(item.href, item.exact))?.label ?? "Admin"}
          </span>

          <div className="ms-auto flex items-center gap-1">
            <Link
              href="/en"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded px-3 py-1.5 text-xs text-muted transition-colors hover:bg-sunken hover:text-fg"
            >
              View site ↗
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
