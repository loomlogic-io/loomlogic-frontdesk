const SENSITIVE_KEY =
  /authorization|cookie|token|secret|password|transcript|message|body|phone|email/i;

const REDACTED = "[REDACTED]";
const MAX_DEPTH = 5;

export function redactLogContext(value: unknown, depth = 0): unknown {
  if (depth >= MAX_DEPTH) {
    return "[MAX_DEPTH]";
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactLogContext(item, depth + 1));
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    return Object.fromEntries(
      Object.entries(record).map(([key, item]) => [
        key,
        SENSITIVE_KEY.test(key) ? REDACTED : redactLogContext(item, depth + 1),
      ]),
    );
  }

  return value;
}
