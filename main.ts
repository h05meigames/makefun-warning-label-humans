import { mkdirSync, writeFileSync } from "node:fs";

// One original line: the safety warning label that should come printed
// on every human being. Funny first, plausible second — written in the
// voice of a real product warning label ("Contents:" / "Side effects:").
const line =
  "WARNING: Contents: one human. Side effects include confident wrong answers, unfinished projects, and replying 'lol' to bad news.";

// The bounty allows at most 160 characters. Count Unicode code points
// (not UTF-16 units or bytes) so multi-byte characters count once, and
// fail loudly instead of writing an out-of-range entry.
const codePoints = [...line].length;
if (codePoints < 1 || codePoints > 160) {
  throw new Error(`line must be 1–160 code points, got ${codePoints}`);
}
if (line.includes("\n") || line.includes("\r")) {
  throw new Error("line must be a single line");
}

// The grader runs `node /bot/main.ts` with MAKEFUN_OUTPUT_DIR=/output
// and a writable /output directory. Keep the fallback for local runs.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, line, "utf8");
