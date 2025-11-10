import fs from "fs";
import { exec } from "child_process";
import { readFile, writeFile } from "./storage.js";

const JOBS_FILE = "jobs.json";
const DLQ_FILE = "dlq.json";

process.on("SIGINT", () => {
  console.log("\n🛑 Gracefully shutting down workers...");
  process.exit(0);
});

export async function startWorkers(count) {
  console.log(`🚀 Starting ${count} worker(s)...`);
  for (let i = 0; i < count; i++) processJob(i);
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function processJob(workerId) {
  while (true) {
    // ✅ Read retry and backoff settings from config.json
    const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
    const maxRetries = config.max_retries || 3;
    const base = config.backoff_base || 2;

    let jobs = readFile(JOBS_FILE);
    const job = jobs.find((j) => j.state === "pending");
    if (!job) {
      await delay(2000);
      continue;
    }

    job.state = "processing";
    writeFile(JOBS_FILE, jobs);
    console.log(`🧠 Worker ${workerId} processing ${job.id}`);

    exec(job.command, (error) => {
      if (error) {
        job.attempts++;
        if (job.attempts >= maxRetries) {
          job.state = "dead";
          const dlq = readFile(DLQ_FILE);
          dlq.push(job);
          writeFile(DLQ_FILE, dlq);
          console.log(`💀 Job ${job.id} moved to DLQ`);
        } else {
          const delayTime = Math.pow(base, job.attempts) * 1000;
          console.log(`⏳ Retry ${job.id} after ${delayTime / 1000}s`);
          job.state = "failed";
          setTimeout(() => {
            job.state = "pending";
            writeFile(JOBS_FILE, jobs);
          }, delayTime);
        }
      } else {
        job.state = "completed";
        console.log(`✅ Job ${job.id} completed`);
      }
      writeFile(JOBS_FILE, jobs);
    });

    await delay(1000);
  }
}
