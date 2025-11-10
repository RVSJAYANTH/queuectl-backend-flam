import { readFile, writeFile } from "../queue/storage.js";

export default function dlqCmd(action, jobId) {
  const dlq = readFile("dlq.json");
  if (action === "list") {
    console.table(dlq.map(j => ({ id: j.id, command: j.command })));
  } else if (action === "retry") {
    const job = dlq.find(j => j.id === jobId);
    if (!job) return console.log("❌ Job not found in DLQ.");
    job.state = "pending";
    const jobs = readFile("jobs.json");
    jobs.push(job);
    writeFile("jobs.json", jobs);
    writeFile("dlq.json", dlq.filter(j => j.id !== jobId));
    console.log(`🔁 Job ${jobId} moved back to queue.`);
  }
}
