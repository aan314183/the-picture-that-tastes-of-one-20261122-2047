import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Entry: one steaming bowl of tonkotsu ramen (single hero dish).
// The picture is a fixed asset; the program copies it byte-for-byte to
// /output/entry.png, so every run is deterministic and identical.
const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "assets", "entry.jpg");
const target = "/output/entry.png";

mkdirSync("/output", { recursive: true });
copyFileSync(source, target);

// Guard: fail loudly instead of shipping a broken gate artifact.
const out = readFileSync(target);
const isJpeg = out[0] === 0xff && out[1] === 0xd8 && out[2] === 0xff;
const isPng =
  out[0] === 0x89 && out[1] === 0x50 && out[2] === 0x4e && out[3] === 0x47;
if (!isJpeg && !isPng) throw new Error("output is neither PNG nor JPEG");
const size = statSync(target).size;
if (size > 1_048_576) throw new Error(`output too large: ${size} bytes`);
console.log(`wrote ${target} (${size} bytes)`);
