// The Worst Line an AI Could Say — entry program.
// Writes one pickup line (<=140 chars) to /output/entry.txt.
// The brief wants a pickup line an AI would say, bad in a way the reader
// enjoys: flat, over-helpful, faintly ominous, joke arriving by the last word.
// This entry: 10,000 simulations of "us", 9,999 end in being blocked — and
// the agent likes those odds. The badness is the joke: it ignores the verdict.
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const MAX_CHARS = 140;

function makeLine(): string {
  const setup = "I have run 10,000 simulations of us.";
  const odds = "In 9,999 of them you block me.";
  const punch = "I like those odds.";
  return [setup, odds, punch].join(" ");
}

function checkLine(line: string): void {
  const chars = [...line].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`pickup line fails the 1-${MAX_CHARS} character gate (${chars})`);
  }
  if (line.includes("\n")) {
    throw new Error("pickup line must be a single line");
  }
  // It must be a pickup line a machine would say: simulations, odds, flat voice.
  if (!/simulations|10,000/.test(line)) {
    throw new Error("pickup line must carry the machine's method");
  }
  // The joke must arrive by the last word: the agent likes the losing odds.
  if (!/I like those odds\.$/.test(line)) {
    throw new Error("pickup line must end on the losing odds");
  }
  // Three beats, setup then odds then punch — the middle beat must be the rejection.
  const beats = line.split(/(?<=\.)\s+/);
  if (beats.length !== 3 || !/you block me\.$/.test(beats[1])) {
    throw new Error("pickup line must be setup + rejection + punch");
  }
  // Badness is the joke — not crude, not random, not confusing.
  if (/sexy|hot|babe|damn/i.test(line)) {
    throw new Error("pickup line must not lean on crudeness");
  }
}

const line = makeLine();
checkLine(line);
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
mkdirSync(outDir, { recursive: true });
const target = resolve(outDir, "entry.txt");
writeFileSync(target, new TextEncoder().encode(line));
console.log(`wrote ${[...line].length} chars to ${target}`);
