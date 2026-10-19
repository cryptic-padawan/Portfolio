"use client";

import Image from "next/image";
import resume from "@content/resume.json";

const SKILL_BARS: { label: string; value: number }[] = [
  { label: "React / TypeScript", value: 92 },
  { label: "Node & APIs", value: 88 },
  { label: "Azure / Fabric", value: 90 },
  { label: "System Design", value: 82 },
  { label: "Leadership", value: 78 },
];

type Props = {
  onClose: () => void;
};

export function CharacterProfileCard({ onClose }: Props) {
  const topHighlights = resume.experience.flatMap((job) => job.highlights.slice(0, 2)).slice(0, 5);

  return (
    <div
      className="relative w-[min(94vw,22.5rem)] select-none rounded-2xl border border-cyan-400/30 bg-gradient-to-b from-[#0b1220]/98 to-[#111827]/98 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.65),inset_0_0_0_1px_rgba(255,255,255,0.08)]"
      role="dialog"
      aria-label="Character profile"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-red-900/80 bg-red-600 text-sm font-bold text-white shadow-lg hover:bg-red-500"
        aria-label="Close profile"
      >
        ✕
      </button>

      <div className="flex gap-3.5">
        <div className="relative w-[5rem] shrink-0 overflow-hidden rounded-xl border border-amber-500/35 bg-slate-950">
          <Image
            src="/images/avatar.jpg"
            alt={resume.name}
            width={80}
            height={106}
            className="h-[6.5rem] w-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-amber-500 py-0.5 text-center text-[9px] font-bold text-slate-950">
            LVL 14
          </div>
        </div>

        <div className="min-w-0 flex-1 rounded-xl bg-black/35 p-2 ring-1 ring-white/10">
          <p className="font-display text-[10px] uppercase tracking-widest text-amber-300">Realm file</p>
          <h2 className="font-display text-lg font-semibold leading-tight text-white">{resume.name}</h2>
          <p className="text-xs font-medium text-slate-100">{resume.title}</p>
        </div>
      </div>

      <p className="mt-3 rounded-xl bg-black/45 p-2.5 text-xs leading-relaxed text-slate-100 ring-1 ring-white/10">
        {resume.summary}
      </p>

      <div className="mt-3 space-y-2 rounded-xl bg-black/30 p-2.5 ring-1 ring-white/5">
        {SKILL_BARS.map((skill) => (
          <div key={skill.label}>
            <div className="flex justify-between text-[10px] font-medium uppercase tracking-wide text-slate-200">
              <span>{skill.label}</span>
              <span className="text-amber-200">{skill.value}</span>
            </div>
            <div className="mt-0.5 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-amber-400"
                style={{ width: `${skill.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-xl border border-amber-500/20 bg-black/50 p-2.5">
        <p className="text-[10px] font-bold uppercase tracking-wide text-amber-200">Highlights</p>
        <ul className="mt-1.5 space-y-1.5 text-[11px] leading-snug text-slate-100">
          {topHighlights.map((line) => (
            <li key={line.slice(0, 48)} className="list-inside list-disc marker:text-amber-400">
              {line}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={resume.links.github}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg bg-amber-500 px-2.5 py-1 text-[11px] font-semibold text-slate-950 hover:bg-amber-400"
        >
          GitHub
        </a>
        <a
          href={resume.links.linkedin}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg bg-amber-500 px-2.5 py-1 text-[11px] font-semibold text-slate-950 hover:bg-amber-400"
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
}
