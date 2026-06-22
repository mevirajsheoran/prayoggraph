/**
 * Tiny logger utility. In production, you might swap this for winston/pino.
 * For a hackathon, a console wrapper with prefixes is plenty.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const PREFIX = "[PrayogGraph]";

class Logger {
  private enabled: boolean;

  constructor(enabled = true) {
    this.enabled = enabled;
  }

  private log(level: LogLevel, ...args: unknown[]) {
    if (!this.enabled && level === "debug") return;
    const fn =
      level === "error"
        ? console.error
        : level === "warn"
        ? console.warn
        : console.log;
    fn(`${PREFIX}[${level.toUpperCase()}]`, ...args);
  }

  debug(...args: unknown[]) {
    this.log("debug", ...args);
  }
  info(...args: unknown[]) {
    this.log("info", ...args);
  }
  warn(...args: unknown[]) {
    this.log("warn", ...args);
  }
  error(...args: unknown[]) {
    this.log("error", ...args);
  }
}

export const logger = new Logger(
  typeof process !== "undefined" ? process.env.NODE_ENV !== "production" : true
);