#!/usr/bin/env node
import { Command } from "commander";
import enqueueCmd from "./commands/enqueue.js";
import statusCmd from "./commands/status.js";
import listCmd from "./commands/list.js";
import workerCmd from "./commands/worker.js";
import dlqCmd from "./commands/dlq.js";
import configCmd from "./commands/configCmd.js";

const program = new Command();

program
  .name("queuectl")
  .description("CLI-based background job queue system")
  .version("1.0.0");

program
  .command("enqueue <job>")
  .description("Add a new job to the queue")
  .action(enqueueCmd);

program
  .command("status")
  .description("Show summary of job states and active workers")
  .action(statusCmd);

program
  .command("list")
  .option("--state <state>", "Filter by job state")
  .description("List jobs by state")
  .action(listCmd);

program
  .command("worker <action>")
  .option("--count <count>", "Number of workers", "1")
  .description("Start or stop workers")
  .action(workerCmd);

program
  .command("dlq <action> [jobId]")
  .description("View or retry DLQ jobs")
  .action(dlqCmd);

program
  .command("config <action> [key] [value]")
  .description("View or modify configuration")
  .action(configCmd);

program.parse(process.argv);
