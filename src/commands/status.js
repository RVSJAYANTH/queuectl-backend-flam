import { readFile } from "../queue/storage.js";

export default function statusCmd() {
  const jobs = readFile("jobs.json");
  const states = ["pending", "processing", "completed", "failed", "dead"];
  const summary = {};
  for (const s of states) summary[s] = jobs.filter((j) => j.state === s).length;
  console.log("📊 Job Status Summary:");
  for (const [state, count] of Object.entries(summary)) {
    console.log(`${state}: ${count}`);
  }
}
