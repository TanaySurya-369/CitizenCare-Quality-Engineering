import { Builder, WebDriver, Capabilities } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import firefox from 'selenium-webdriver/firefox';
import edge from 'selenium-webdriver/edge';

export type SupportedBrowser = 'chrome' | 'firefox' | 'edge';

export class WebDriverFactory {
  private static drivers: Map<string, WebDriver> = new Map();

  static async createDriver(
    browser: SupportedBrowser = (process.env.BROWSER as SupportedBrowser) || 'chrome',
    headless: boolean = process.env.HEADLESS !== 'false'
  ): Promise<WebDriver> {
    const threadId = process.env.TEST_THREAD_ID || 'default';

    if (this.drivers.has(threadId)) {
      const existing = this.drivers.get(threadId)!;
      try {
        await existing.getTitle();
        return existing;
      } catch {
        this.drivers.delete(threadId);
      }
    }

    let builder = new Builder().forBrowser(browser);

    switch (browser) {
      case 'firefox': {
        const ffOptions = new firefox.Options();
        if (headless) {
          ffOptions.addArguments('-headless');
        }
        builder = builder.setFirefoxOptions(ffOptions);
        break;
      }

      case 'edge': {
        const edgeOptions = new edge.Options();
        if (headless) {
          edgeOptions.addArguments('--headless=new');
        }
        edgeOptions.addArguments(
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--window-size=1920,1080',
          '--disable-gpu'
        );
        builder = builder.setEdgeOptions(edgeOptions);
        break;
      }

      case 'chrome':
      default: {
        const chromeOptions = new chrome.Options();
        if (headless) {
          chromeOptions.addArguments('--headless=new');
        }
        chromeOptions.addArguments(
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--window-size=1920,1080',
          '--disable-gpu',
          '--remote-debugging-pipe'
        );
        builder = builder.setChromeOptions(chromeOptions);
        break;
      }
    }

    const driver = await builder.build();
    await driver.manage().setTimeouts({ implicit: 5000, pageLoad: 30000, script: 30000 });
    this.drivers.set(threadId, driver);
    return driver;
  }

  static async quitDriver(threadId: string = 'default'): Promise<void> {
    if (this.drivers.has(threadId)) {
      const driver = this.drivers.get(threadId)!;
      try {
        await driver.quit();
      } catch (err) {
        console.warn('Driver quit notice:', err);
      } finally {
        this.drivers.delete(threadId);
      }
    }
  }

  static async quitAllDrivers(): Promise<void> {
    for (const [threadId, driver] of this.drivers.entries()) {
      try {
        await driver.quit();
      } catch {}
      this.drivers.delete(threadId);
    }
  }
}
