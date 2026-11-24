import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

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
// Reject control and invisible format characters (C0/C1 controls,
// zero-width space, BOM, soft hyphen, ...). The gate rejects an entry
// that is only white space, and a line padded with invisible characters
// would read as blank or garbled on a printed label; require at least
// one visible character as well.
if (/[\p{Cc}\p{Cf}]/u.test(line)) {
  throw new Error("line must not contain control or invisible characters");
}
if (!/[^\s]/u.test(line)) {
  throw new Error("line must contain at least one visible character");
}

// The grader runs `node /bot/main.ts` with MAKEFUN_OUTPUT_DIR=/output
// and a writable /output directory. Keep the fallback for local runs.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, line, "utf8");
// Read the file back and confirm it is byte-for-byte the line we meant
// to write: no trailing newline, no encoding surprise, nothing dropped.
const written = readFileSync(`${outDir}/entry.txt`, "utf8");
if (written !== line) {
  throw new Error("entry.txt does not match the line exactly");
}
