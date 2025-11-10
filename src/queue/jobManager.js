import { readFile, writeFile } from "./storage.js";

const JOBS_FILE = "jobs.json";

export function addJob(job) {
  const jobs = readFile(JOBS_FILE);
  jobs.push(job);
  writeFile(JOBS_FILE, jobs);
}

export function getJobsByState(state) {
  const jobs = readFile(JOBS_FILE);
  if (!state) return jobs;
  return jobs.filter((j) => j.state === state);
}

export function updateJob(id, updates) {
  const jobs = readFile(JOBS_FILE);
  const index = jobs.findIndex((j) => j.id === id);
  if (index !== -1) {
    jobs[index] = { ...jobs[index], ...updates, updated_at: new Date().toISOString() };
    writeFile(JOBS_FILE, jobs);
  }
}
