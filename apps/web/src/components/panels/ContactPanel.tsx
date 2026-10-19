"use client";

import { FormEvent, useState } from "react";
import emailjs from "@emailjs/browser";
import { useWorldStore } from "@/store/worldStore";

const discordUrl =
  process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ?? "https://discord.gg/v4nn8H9Q46";

export function ContactPanel() {
  const setPanel = useWorldStore((s) => s.setPanel);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const service = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const template = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const key = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    if (!service || !template || !key) {
      setStatus("err");
      return;
    }
    setStatus("sending");
    try {
      await emailjs.sendForm(service, template, form, { publicKey: key });
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("err");
    }
  }

  return (
    <aside className="glass-panel fixed bottom-4 left-4 right-4 z-30 p-5 md:left-auto md:w-[26rem]">
      <div className="flex justify-between">
        <h2 className="font-display text-lg text-arcane-glow">Sending Stone</h2>
        <button type="button" className="text-slate-400" onClick={() => setPanel("none")}>
          ✕
        </button>
      </div>
      <p className="mt-2 text-sm text-slate-400">Email or join the guild hall on Discord.</p>
      <a
        href={discordUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-block rounded-lg border border-indigo-400/50 px-4 py-2 text-sm text-indigo-200 hover:bg-indigo-500/10"
      >
        Discord server · .sahilverma
      </a>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input
          name="from_name"
          required
          placeholder="Your name"
          className="w-full rounded border border-white/10 bg-black/30 px-3 py-2 text-sm"
        />
        <input
          name="reply_to"
          type="email"
          required
          placeholder="Your email"
          className="w-full rounded border border-white/10 bg-black/30 px-3 py-2 text-sm"
        />
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Message"
          className="w-full rounded border border-white/10 bg-black/30 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-lg bg-arcane-glow py-2 text-sm font-medium text-arcane-night"
        >
          {status === "sending" ? "Sending…" : "Send scroll"}
        </button>
        {status === "ok" && <p className="text-xs text-green-400">Message sent.</p>}
        {status === "err" && (
          <p className="text-xs text-amber-400">
            EmailJS not configured yet — use Discord or add keys to .env.local
          </p>
        )}
      </form>
    </aside>
  );
}
