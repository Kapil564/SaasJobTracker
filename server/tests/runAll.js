/*
  Master Test Runner
  ──────────────────
  Run:   node tests/runAll.js
  Needs: Server running (npm run dev)

  Runs all test suites sequentially.
  Pass --skip-ai to skip AI tests (they need GEMINI_API_KEY).

  Examples:
    node tests/runAll.js              ← run everything
    node tests/runAll.js --skip-ai    ← skip AI tests
*/

import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const skipAi = process.argv.includes("--skip-ai");

const suites = [
  { name: "Auth", file: "tests/auth.test.js" },
  { name: "Applications", file: "tests/applications.test.js" },
];

if (!skipAi) {
  suites.push({ name: "AI (Gemini)", file: "tests/ai.test.js" });
} else {
  console.log("⏭️  Skipping AI tests (--skip-ai flag)\n");
}

console.log("🚀 RUNNING ALL TEST SUITES\n" + "═".repeat(50) + "\n");

let allPassed = true;

for (const suite of suites) {
  console.log(`\n${"─".repeat(50)}`);
  console.log(`▶️  ${suite.name} Tests (${suite.file})`);
  console.log("─".repeat(50));

  try {
    execSync(`node ${suite.file}`, {
      cwd: rootDir,
      stdio: "inherit",
      timeout: 60000, // 60s timeout per suite
    });
  } catch (err) {
    allPassed = false;
    console.log(`\n⚠️  ${suite.name} suite had failures.`);
  }
}

console.log("\n" + "═".repeat(50));
if (allPassed) {
  console.log("🏆 ALL TEST SUITES PASSED!");
} else {
  console.log("❌ SOME TEST SUITES FAILED — check output above.");
  process.exit(1);
}
console.log("═".repeat(50) + "\n");
