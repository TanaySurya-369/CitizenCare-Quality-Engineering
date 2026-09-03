import { WebDriver, By, until, WebElement } from 'selenium-webdriver';
import { ConfigReader } from '../utilities/ConfigReader';
import { Logger } from '../utilities/Logger';
import { ScreenshotUtil } from '../utilities/ScreenshotUtil';

export abstract class BasePage {
  protected driver: WebDriver;
  protected timeoutMs: number;

  constructor(driver: WebDriver) {
    this.driver = driver;
    this.timeoutMs = ConfigReader.timeout;
  }

  async navigateTo(path: string = ''): Promise<void> {
    const url = `${ConfigReader.baseUrl}${path}`;
    Logger.info(`Navigating to: ${url}`, this.constructor.name);
    await this.driver.get(url);
  }

  async waitForElementVisible(locator: By, timeoutMs?: number): Promise<WebElement> {
    const t = timeoutMs || this.timeoutMs;
    try {
      return await this.driver.wait(until.elementLocated(locator), t);
    } catch (err: any) {
      await ScreenshotUtil.captureScreenshot(this.driver, `timeout_${locator.toString()}`);
      throw new Error(`[${this.constructor.name}] Element not visible within ${t}ms: ${locator.toString()}`);
    }
  }

  async waitForElementClickable(locator: By, timeoutMs?: number): Promise<WebElement> {
    const element = await this.waitForElementVisible(locator, timeoutMs);
    await this.driver.wait(until.elementIsEnabled(element), timeoutMs || this.timeoutMs);
    return element;
  }

  async click(locator: By, description?: string): Promise<void> {
    if (description) {
      Logger.info(`Clicking: ${description}`, this.constructor.name);
    }
    const element = await this.waitForElementClickable(locator);
    await element.click();
  }

  async type(locator: By, text: string, description?: string): Promise<void> {
    if (description) {
      Logger.info(`Typing into: ${description}`, this.constructor.name);
    }
    const element = await this.waitForElementVisible(locator);
    await element.clear();
    await element.sendKeys(text);
  }

  async getText(locator: By): Promise<string> {
    const element = await this.waitForElementVisible(locator);
    return (await element.getText()).trim();
  }

  async isElementPresent(locator: By, timeoutMs: number = 3000): Promise<boolean> {
    try {
      await this.waitForElementVisible(locator, timeoutMs);
      return true;
    } catch {
      return false;
    }
  }

  async getCurrentUrl(): Promise<string> {
    return this.driver.getCurrentUrl();
  }

  async getPageTitle(): Promise<string> {
    return this.driver.getTitle();
  }
}
