import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dir = new URL("../schemas", import.meta.url).pathname;
for (const file of readdirSync(dir).filter((name) => name.endsWith(".json"))) {
  JSON.parse(readFileSync(join(dir, file), "utf8"));
  console.log(`schema ok: ${file}`);
}
