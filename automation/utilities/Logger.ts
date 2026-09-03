export class Logger {
  static info(message: string, context?: string): void {
    const timestamp = new Date().toISOString();
    const ctx = context ? `[${context}]` : '';
    console.log(`\x1b[36m[INFO]\x1b[0m \x1b[90m${timestamp}\x1b[0m ${ctx} ${message}`);
  }

  static pass(message: string, context?: string): void {
    const timestamp = new Date().toISOString();
    const ctx = context ? `[${context}]` : '';
    console.log(`\x1b[32m[PASS]\x1b[0m \x1b[90m${timestamp}\x1b[0m ${ctx} ✔ ${message}`);
  }

  static warn(message: string, context?: string): void {
    const timestamp = new Date().toISOString();
    const ctx = context ? `[${context}]` : '';
    console.warn(`\x1b[33m[WARN]\x1b[0m \x1b[90m${timestamp}\x1b[0m ${ctx} ⚠ ${message}`);
  }

  static error(message: string, error?: any, context?: string): void {
    const timestamp = new Date().toISOString();
    const ctx = context ? `[${context}]` : '';
    console.error(`\x1b[31m[ERROR]\x1b[0m \x1b[90m${timestamp}\x1b[0m ${ctx} ✖ ${message}`, error || '');
  }

  static step(stepNumber: number, description: string): void {
    console.log(`\x1b[35m[STEP ${stepNumber}]\x1b[0m ➔ ${description}`);
  }
}
