import Link from "next/link";
import type { ReactNode } from "react";

export function GameShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto min-h-screen max-w-lg px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/" className="text-sm text-arcane-glow underline">
          ← Realm
        </Link>
        <h1 className="font-display text-lg text-arcane-glow">{title}</h1>
      </div>
      <div className="glass-panel p-4">{children}</div>
    </main>
  );
}
