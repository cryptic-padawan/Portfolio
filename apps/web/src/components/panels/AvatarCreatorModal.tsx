"use client";

import { useState } from "react";
import { AvatarCreator } from "@readyplayerme/react-avatar-creator";
import { useAvatarStore } from "@/store/avatarStore";
import { LOCAL_DEFAULT_MODEL, RPM_EXAMPLE_MODEL } from "@/lib/rpmAssets";

const subdomain = process.env.NEXT_PUBLIC_RPM_SUBDOMAIN?.trim() || "demo";

export function AvatarCreatorModal() {
  const open = useAvatarStore((s) => s.creatorOpen);
  const setCreatorOpen = useAvatarStore((s) => s.setCreatorOpen);
  const setModelUrl = useAvatarStore((s) => s.setModelUrl);
  const [pasteUrl, setPasteUrl] = useState("");
  const [useCreator, setUseCreator] = useState(true);

  if (!open) return null;

  const applyPaste = () => {
    const url = pasteUrl.trim();
    if (url.startsWith("http") && url.includes(".glb")) {
      setModelUrl(url);
      setCreatorOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4">
      <div className="relative flex h-[min(90vh,720px)] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-arcane-glow/40 bg-arcane-night shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-700 px-4 py-2">
          <p className="font-display text-sm text-arcane-glow">Forge your realm avatar</p>
          <button
            type="button"
            className="text-slate-400 hover:text-white"
            onClick={() => setCreatorOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="border-b border-slate-800 px-4 py-2 text-xs text-slate-400">
          If <span className="text-slate-300">readyplayer.me</span> does not load on your network (DNS /
          office firewall), paste a <span className="text-arcane-glow">.glb</span> URL below or use the default
          avatar. Docs:{" "}
          <a
            className="text-arcane-glow underline"
            href="https://github.com/readyplayerme"
            target="_blank"
            rel="noreferrer"
          >
            github.com/readyplayerme
          </a>
        </div>

        <div className="flex gap-2 border-b border-slate-800 px-4 py-2">
          <button
            type="button"
            className={`rounded px-3 py-1 text-xs ${useCreator ? "bg-arcane-glow/20 text-arcane-glow" : "text-slate-400"}`}
            onClick={() => setUseCreator(true)}
          >
            RPM creator (iframe)
          </button>
          <button
            type="button"
            className={`rounded px-3 py-1 text-xs ${!useCreator ? "bg-arcane-glow/20 text-arcane-glow" : "text-slate-400"}`}
            onClick={() => setUseCreator(false)}
          >
            Paste GLB URL
          </button>
        </div>

        {useCreator ? (
          <div className="min-h-0 flex-1">
            <AvatarCreator
              subdomain={subdomain}
              style={{ width: "100%", height: "100%", border: "none" }}
              config={{ bodyType: "fullbody", language: "en" }}
              onAvatarExported={(event) => {
                const url = event.data.url;
                if (url) setModelUrl(url);
              }}
            />
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-3 p-4">
            <label className="text-sm text-slate-300">
              Avatar GLB URL (from Ready Player Me export or any RPM-compatible link)
            </label>
            <input
              type="url"
              value={pasteUrl}
              onChange={(e) => setPasteUrl(e.target.value)}
              placeholder={RPM_EXAMPLE_MODEL}
              className="rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded bg-arcane-glow px-4 py-2 text-sm font-medium text-arcane-night"
                onClick={applyPaste}
              >
                Use this avatar
              </button>
              <button
                type="button"
                className="rounded border border-slate-600 px-4 py-2 text-sm text-slate-300"
                onClick={() => {
                  setModelUrl(LOCAL_DEFAULT_MODEL);
                  setCreatorOpen(false);
                }}
              >
                Reset to default
              </button>
            </div>
          </div>
        )}

        <p className="border-t border-slate-800 px-4 py-2 text-[10px] text-slate-500">
          Optional: <code className="text-slate-400">NEXT_PUBLIC_RPM_SUBDOMAIN</code> and{" "}
          <code className="text-slate-400">NEXT_PUBLIC_RPM_AVATAR_URL</code> in{" "}
          <code className="text-slate-400">apps/web/.env.local</code>
        </p>
      </div>
    </div>
  );
}
