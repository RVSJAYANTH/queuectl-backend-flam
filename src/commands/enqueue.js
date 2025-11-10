import { addJob } from "../queue/jobManager.js";

export default function enqueueCmd(jobStr) {
  const job = JSON.parse(jobStr);
  job.state = "pending";
  job.attempts = 0;
  job.max_retries = job.max_retries || 3;
  job.created_at = new Date().toISOString();
  job.updated_at = new Date().toISOString();
  addJob(job);
  console.log(`✅ Job '${job.id}' enqueued successfully.`);
}
