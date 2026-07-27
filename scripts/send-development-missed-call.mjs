import { createHmac } from "node:crypto";
import { readFile } from "node:fs/promises";

const secret = process.env.DEV_WEBHOOK_SIGNING_SECRET;
const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000";

if (!secret || secret.length < 32) {
  throw new Error(
    "Set DEV_WEBHOOK_SIGNING_SECRET to at least 32 characters before sending a fixture.",
  );
}

const fixtureUrl = new URL(
  "../tests/fixtures/development-missed-call.json",
  import.meta.url,
);
const rawBody = await readFile(fixtureUrl, "utf8");
const timestamp = String(Math.floor(Date.now() / 1000));
const signature = createHmac("sha256", secret)
  .update(`${timestamp}.${rawBody}`)
  .digest("hex");

const response = await fetch(new URL("/api/webhooks/development/missed-call", baseUrl), {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-loomlogic-timestamp": timestamp,
    "x-loomlogic-signature": signature,
  },
  body: rawBody,
});
const result = await response.json();

console.log(JSON.stringify({ status: response.status, result }, null, 2));

if (!response.ok) {
  process.exitCode = 1;
}
