import { startWorkers } from "../queue/workerManager.js";

export default function workerCmd(action, opts) {
  if (action === "start") startWorkers(parseInt(opts.count));
  else if (action === "stop") console.log("🛑 Stop command not implemented yet (manual stop with Ctrl+C).");
  else console.log("Unknown worker action. Use start/stop.");
}
