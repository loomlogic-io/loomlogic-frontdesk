import "server-only";

import { redactLogContext } from "@/lib/logging/redact";

type LogLevel = "debug" | "info" | "warn" | "error";

type LogContext = Readonly<Record<string, unknown>>;

function write(level: LogLevel, event: string, context: LogContext = {}) {
  const record = {
    timestamp: new Date().toISOString(),
    level,
    event,
    context: redactLogContext(context),
  };

  const serialized = JSON.stringify(record);

  if (level === "error") {
    console.error(serialized);
    return;
  }

  if (level === "warn") {
    console.warn(serialized);
    return;
  }

  console.info(serialized);
}

export const logger = {
  debug(event: string, context?: LogContext) {
    if (process.env.LOG_LEVEL === "debug") {
      write("debug", event, context);
    }
  },
  info(event: string, context?: LogContext) {
    write("info", event, context);
  },
  warn(event: string, context?: LogContext) {
    write("warn", event, context);
  },
  error(event: string, context?: LogContext) {
    write("error", event, context);
  },
};
