// Offline-friendly browser setup for the constrained preview sandbox.
import chromium, { inflate } from "@sparticuz/chromium";
import { join } from "node:path";
await chromium.executablePath();
await inflate(
  join(process.cwd(), "node_modules/@sparticuz/chromium/bin/al2023.tar.br"),
);
