#!/usr/bin/env node
import path from "node:path";
import {
  getSyncStatus,
  runPushToVengeance,
} from "../src/lib/sync/push-to-vengeance";
import { runPushToObsidian } from "../src/lib/sync/push-to-obsidian";

const rootDir = path.resolve(process.cwd());

function printResult(label: string, result: {
  created: string[];
  updated: string[];
  skipped: string[];
}) {
  console.log(label);
  if (result.created.length) {
    console.log(`Created:\n  ${result.created.join("\n  ")}`);
  }
  if (result.updated.length) {
    console.log(`Updated:\n  ${result.updated.join("\n  ")}`);
  }
  if (result.skipped.length) {
    console.log(`Skipped:\n  ${result.skipped.join("\n  ")}`);
  }
}

function printUsage() {
  console.log(`Obsidian sync commands:

  npm run sync:status   Check vault connection and note counts
  npm run sync:push     Copy notes from Obsidian into the blog
  npm run sync:pull     Copy blog posts back into Obsidian
`);
}

function getPushTarget() {
  const args = process.argv.slice(3);

  if (args[0] === "--to") {
    return args[1];
  }

  return args[0];
}

const command = process.argv[2] ?? "help";

try {
  if (command === "help" || command === "--help" || command === "-h") {
    printUsage();
    process.exit(0);
  }

  if (command === "status") {
    const status = getSyncStatus(rootDir);
    console.log(`Vault: ${status.vaultPath}`);
    console.log(`Linked entries: ${status.linkedEntries}`);
    for (const folder of status.folders) {
      console.log(
        `- ${folder.obsidianFolder} -> content/blog/${folder.blogCategory}/ | exists=${folder.folderExists} notes=${folder.noteCount}`,
      );
    }
    process.exit(0);
  }

  if (command === "push" && getPushTarget() === "vengeance") {
    printResult("Obsidian -> Vengeance sync complete", runPushToVengeance(rootDir));
    process.exit(0);
  }

  if (command === "pull" || (command === "push" && getPushTarget() === "obsidian")) {
    printResult("Vengeance -> Obsidian sync complete", runPushToObsidian(rootDir));
    process.exit(0);
  }

  printUsage();
  process.exit(1);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
