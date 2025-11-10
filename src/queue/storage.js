import fs from "fs";

export function readFile(file) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "[]");
  const data = fs.readFileSync(file, "utf8");
  return JSON.parse(data || "[]");
}

export function writeFile(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}
