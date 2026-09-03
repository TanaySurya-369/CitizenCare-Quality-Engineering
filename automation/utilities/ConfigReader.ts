import path from 'path';
import fs from 'fs';

export interface AutomationEnvironmentConfig {
  name: string;
  baseUrl: string;
  apiBaseUrl: string;
  defaultTimeout: number;
  browser: 'chrome' | 'firefox' | 'edge';
  headless: boolean;
}

export class ConfigReader {
  private static config: AutomationEnvironmentConfig;

  static load(): AutomationEnvironmentConfig {
    if (this.config) return this.config;

    const env = process.env.TEST_ENV || 'dev';
    const configPath = path.resolve(__dirname, `../test-data/environments/${env}.json`);

    if (fs.existsSync(configPath)) {
      const raw = fs.readFileSync(configPath, 'utf-8');
      this.config = JSON.parse(raw);
    } else {
      this.config = {
        name: 'default-dev',
        baseUrl: process.env.BASE_URL || 'http://localhost:5173',
        apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000/api',
        defaultTimeout: 15000,
        browser: 'chrome',
        headless: process.env.HEADLESS !== 'false',
      };
    }

    return this.config;
  }

  static get baseUrl(): string {
    return this.load().baseUrl;
  }

  static get apiBaseUrl(): string {
    return this.load().apiBaseUrl;
  }

  static get timeout(): number {
    return this.load().defaultTimeout;
  }
}
