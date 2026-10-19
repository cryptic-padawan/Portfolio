import Link from "next/link";
import resume from "@content/resume.json";
import { GAME_REGISTRY } from "@arcanum/game-core";

const discordUrl =
  process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ?? "https://discord.gg/v4nn8H9Q46";

export default function ClassicPage() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-10">
      <Link href="/" className="text-sm text-arcane-glow underline">
        ← Enter 3D realm
      </Link>
      <h1 className="font-display mt-6 text-3xl text-arcane-glow">{resume.name}</h1>
      <p className="text-slate-300">{resume.title} · {resume.location}</p>
      <p className="mt-4 text-sm leading-relaxed text-slate-400">{resume.summary}</p>
      <section className="mt-8">
        <h2 className="font-display text-arcane-ember">Contact</h2>
        <p className="text-sm">
          <a href={`mailto:${resume.email}`} className="text-arcane-glow underline">{resume.email}</a>
        </p>
        <a href={discordUrl} className="mt-2 inline-block text-sm text-indigo-300 underline">
          Discord guild
        </a>
      </section>
      <section className="mt-8">
        <h2 className="font-display text-arcane-ember">Games</h2>
        <ul className="mt-2 list-inside list-disc text-sm text-slate-300">
          {Object.values(GAME_REGISTRY).map((g) => (
            <li key={g.path}>
              {g.status === "playable" ? (
                <Link href={g.path} className="underline">{g.title}</Link>
              ) : (
                <span>{g.title} (coming soon)</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
