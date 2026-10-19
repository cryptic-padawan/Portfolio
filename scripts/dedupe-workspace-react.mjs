import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const nested = path.join(root, "apps/web/node_modules");

for (const name of ["react", "react-dom", "@types/react", "@types/react-dom"]) {
  const target = path.join(nested, name);
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
    console.log("removed nested", target);
  }
}

const rootReactPkg = path.join(root, "node_modules/react/package.json");
if (fs.existsSync(rootReactPkg)) {
  const v = JSON.parse(fs.readFileSync(rootReactPkg, "utf8")).version;
  if (!v.startsWith("19.")) {
    console.error(`ERROR: root react is ${v}, expected 19.x — run: rm -rf node_modules package-lock.json && npm install`);
    process.exit(1);
  }
  console.log("root react", v);
}
