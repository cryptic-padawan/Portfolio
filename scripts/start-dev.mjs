/**
 * Free port 3920 (Windows) then start Next dev. Safe to run when EADDRINUSE occurs.
 */
import { execSync, spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function freePort3920() {
  try {
    const out = execSync("netstat -ano | findstr :3920", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const pids = new Set();
    for (const line of out.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed.includes("3920")) continue;
      const parts = trimmed.split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && /^\d+$/.test(pid) && pid !== "0") pids.add(pid);
    }
    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
        console.log(`Freed port 3920 (stopped PID ${pid})`);
      } catch {
        /* already gone */
      }
    }
  } catch {
    /* nothing listening */
  }
}

freePort3920();

const child = spawn("npm", ["run", "dev", "-w", "@arcanum/web"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    NEXT_IGNORE_INCORRECT_LOCKFILE: "1",
  },
});

child.on("exit", (code) => process.exit(code ?? 0));
