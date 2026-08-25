#!/usr/bin/env node
import path from "node:path";
import {
  getSyncStatus,
  runPushToVengeance,
} from "../src/lib/sync/push-to-vengeance";

const rootDir = path.resolve(process.cwd());

function printUsage() {
  console.log(`Usage:
  npm run sync:obsidian status
  npm run sync:obsidian push --to vengeance
`);
}

const command = process.argv[2];

try {
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

  if (
    command === "push" &&
    process.argv[3] === "--to" &&
    process.argv[4] === "vengeance"
  ) {
    const result = runPushToVengeance(rootDir);
    console.log("Obsidian -> Vengeance sync complete");
    if (result.created.length) {
      console.log(`Created:\n  ${result.created.join("\n  ")}`);
    }
    if (result.updated.length) {
      console.log(`Updated:\n  ${result.updated.join("\n  ")}`);
    }
    if (result.skipped.length) {
      console.log(`Skipped:\n  ${result.skipped.join("\n  ")}`);
    }
    process.exit(0);
  }

  printUsage();
  process.exit(1);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
