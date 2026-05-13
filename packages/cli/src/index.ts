#!/usr/bin/env node
import { Command } from "commander";
import { readFileSync, writeFileSync } from "node:fs";
import { applyArtifactPatch } from "@agent-artifact-runtime/core";
import type { ArtifactPatch, ArtifactState } from "@agent-artifact-runtime/protocol";

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

const program = new Command();
program.name("artifact").description("Agent Artifact Runtime CLI").version("0.1.0");

program
  .command("validate")
  .argument("file")
  .description("Parse and minimally validate a JSON artifact file")
  .action((file) => {
    const value = readJson<Record<string, unknown>>(file);
    if (typeof value.schema !== "string") throw new Error("Missing schema field");
    console.log(`valid: ${file} (${value.schema})`);
  });

program
  .command("apply-patch")
  .argument("state")
  .argument("patch")
  .option("-o, --out <file>", "write patched state to file")
  .description("Apply an artifact.patch.v1 file to an artifact.state.v1 file")
  .action((stateFile, patchFile, options) => {
    const state = readJson<ArtifactState>(stateFile);
    const patch = readJson<ArtifactPatch>(patchFile);
    const next = applyArtifactPatch(state, patch);
    const output = JSON.stringify(next, null, 2);
    if (options.out) writeFileSync(options.out, output + "\n");
    else console.log(output);
  });

program
  .command("replay")
  .requiredOption("--state <file>", "initial state file")
  .requiredOption("--events <file>", "JSONL event file")
  .description("Replay patch events from a JSONL event log")
  .action((options) => {
    let state = readJson<ArtifactState>(options.state);
    const lines = readFileSync(options.events, "utf8").split(/\r?\n/).filter(Boolean);
    for (const line of lines) {
      const event = JSON.parse(line);
      if (event.type === "patch") state = applyArtifactPatch(state, event.patch);
    }
    console.log(JSON.stringify(state, null, 2));
  });

program.parse();
