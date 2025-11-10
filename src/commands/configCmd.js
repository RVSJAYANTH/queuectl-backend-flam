import fs from "fs";

export default function configCmd(action, key, value) {
  const configPath = "config.json";

  // If config file doesn't exist, create it with defaults
  if (!fs.existsSync(configPath)) {
    const defaults = { max_retries: 3, backoff_base: 2 };
    fs.writeFileSync(configPath, JSON.stringify(defaults, null, 2));
    console.log("⚙️  Config file initialized with defaults:", defaults);
  }

  // Read config file
  let configData = fs.readFileSync(configPath, "utf8");

  // Handle empty file case
  if (!configData.trim()) {
    const defaults = { max_retries: 3, backoff_base: 2 };
    fs.writeFileSync(configPath, JSON.stringify(defaults, null, 2));
    configData = JSON.stringify(defaults);
  }

  const config = JSON.parse(configData);

  if (action === "get") {
    console.log(config);
  } else if (action === "set") {
    if (!key || value === undefined) {
      console.log("❌ Please provide both key and value. Example: queuectl config set max_retries 5");
      return;
    }
    config[key] = isNaN(value) ? value : Number(value);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`✅ Config '${key}' updated to ${value}`);
  } else {
    console.log("❌ Unknown config command. Use 'get' or 'set'.");
  }
}
