"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { admin } from "@/lib/api";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "◫" },
  { href: "/admin/pipeline", label: "Pipeline", icon: "◈" },
  { href: "/admin/pages", label: "Pages", icon: "☰" },
  { href: "/admin/posts", label: "Posts", icon: "✎" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await admin.logout();
    router.push("/admin/login");
  }

  return (
    <aside className="w-64 min-h-screen bg-[#060b16] border-r border-white/5 flex flex-col">
      <div className="px-6 py-6 border-b border-white/5">
        <Link href="/admin" className="block">
          <h1 className="text-lg font-bold text-white tracking-tight">
            AM Admin
          </h1>
          <p className="text-xs text-text-muted mt-0.5">Content Management</p>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-muted hover:text-white hover:bg-white/5 transition-colors"
        >
          <span className="text-base">↗</span>
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-muted hover:text-red-400 hover:bg-red-400/5 transition-colors"
        >
          <span className="text-base">⏻</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
