import { Builder, WebDriver, Capabilities } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import edge from 'selenium-webdriver/edge';
import { ConfigReader } from './ConfigReader';
import { Logger } from './Logger';

export class DriverManager {
  private static driver: WebDriver | null = null;

  static async createDriver(browserOverride?: 'chrome' | 'edge' | 'firefox'): Promise<WebDriver> {
    const config = ConfigReader.load();
    const browser = browserOverride || config.browser || 'chrome';
    const isHeadless = config.headless;

    Logger.info(`Initializing WebDriver for browser: [${browser.toUpperCase()}], Headless: [${isHeadless}]`, 'DriverManager');

    const builder = new Builder().forBrowser(browser);

    if (browser === 'chrome') {
      const options = new chrome.Options();
      if (isHeadless) {
        options.addArguments('--headless=new');
      }
      options.addArguments(
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-size=1920,1080',
        '--ignore-certificate-errors',
        '--disable-extensions'
      );
      builder.setChromeOptions(options);
    } else if (browser === 'edge') {
      const options = new edge.Options();
      if (isHeadless) {
        options.addArguments('--headless=new');
      }
      options.addArguments(
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--window-size=1920,1080'
      );
      builder.setEdgeOptions(options);
    }

    this.driver = await builder.build();
    await this.driver.manage().window().setRect({ width: 1920, height: 1080 });
    return this.driver;
  }

  static async getDriver(): Promise<WebDriver> {
    if (!this.driver) {
      this.driver = await this.createDriver();
    }
    return this.driver;
  }

  static async quitDriver(): Promise<void> {
    if (this.driver) {
      try {
        Logger.info('Terminating WebDriver session...', 'DriverManager');
        await this.driver.quit();
      } catch (err: any) {
        Logger.warn(`Driver quit error: ${err.message}`, 'DriverManager');
      } finally {
        this.driver = null;
      }
    }
  }
}
