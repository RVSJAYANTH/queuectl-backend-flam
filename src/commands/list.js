import { getJobsByState } from "../queue/jobManager.js";

export default function listCmd(opts) {
  const jobs = getJobsByState(opts.state);
  if (jobs.length === 0) {
    console.log(`No jobs found${opts.state ? ` in state '${opts.state}'` : ""}.`);
    return;
  }
  console.table(jobs.map(j => ({ id: j.id, command: j.command, state: j.state, attempts: j.attempts })));
}
