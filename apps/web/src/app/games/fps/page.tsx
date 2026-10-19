import Link from "next/link";
import { GameShell } from "@/components/games/GameShell";

export default function FpsPlaceholderPage() {
  return (
    <GameShell title="Arena · future Unity embed">
      <p className="text-sm text-slate-400">
        Lobby and Unity WebGL embed route reserved for team-based modes. API stub:{" "}
        <code className="text-xs">/api/rooms</code>
      </p>
      <Link href="/" className="mt-4 inline-block text-sm text-arcane-glow underline">
        Back to realm
      </Link>
    </GameShell>
  );
}
