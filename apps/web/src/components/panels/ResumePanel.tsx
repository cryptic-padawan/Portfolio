"use client";

import Image from "next/image";
import resume from "@content/resume.json";
import { useWorldStore } from "@/store/worldStore";

export function ResumePanel() {
  const setPanel = useWorldStore((s) => s.setPanel);

  return (
    <aside className="glass-panel fixed bottom-4 left-4 right-4 z-30 max-h-[70vh] overflow-y-auto p-5 md:left-auto md:w-[28rem]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <Image
            src="/images/avatar.jpg"
            alt={resume.name}
            width={64}
            height={64}
            className="h-16 w-16 shrink-0 rounded-lg object-cover"
          />
          <div>
            <h2 className="font-display text-lg text-arcane-glow">{resume.name}</h2>
            <p className="text-sm text-slate-300">{resume.title}</p>
            <p className="text-xs text-slate-500">{resume.location}</p>
          </div>
        </div>
        <button type="button" className="text-slate-400 hover:text-white" onClick={() => setPanel("none")}>
          ✕
        </button>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-300">{resume.summary}</p>
      <section className="mt-4">
        <h3 className="font-display text-sm text-arcane-ember">Experience</h3>
        {resume.experience.map((job) => (
          <article key={job.company} className="mt-2 border-t border-white/10 pt-2">
            <p className="text-sm font-medium">{job.role}</p>
            <p className="text-xs text-slate-400">
              {job.company} · {job.period}
            </p>
            <ul className="mt-1 list-inside list-disc text-xs text-slate-400">
              {job.highlights.slice(0, 3).map((h) => (
                <li key={h.slice(0, 40)}>{h}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      <section className="mt-4">
        <h3 className="font-display text-sm text-arcane-ember">Skills</h3>
        <p className="mt-1 text-xs text-slate-400">{resume.skills.frontend.join(" · ")}</p>
      </section>
    </aside>
  );
}
