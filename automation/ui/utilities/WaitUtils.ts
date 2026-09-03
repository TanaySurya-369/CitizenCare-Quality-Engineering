import { WebDriver, WebElement, until, By } from 'selenium-webdriver';

export class WaitUtils {
  static async waitForElementVisible(
    driver: WebDriver,
    locator: By,
    timeoutMs: number = 15000
  ): Promise<WebElement> {
    const element = await driver.wait(until.elementLocated(locator), timeoutMs);
    await driver.wait(until.elementIsVisible(element), timeoutMs);
    return element;
  }

  static async waitForElementClickable(
    driver: WebDriver,
    locator: By,
    timeoutMs: number = 15000
  ): Promise<WebElement> {
    const element = await this.waitForElementVisible(driver, locator, timeoutMs);
    await driver.wait(until.elementIsEnabled(element), timeoutMs);
    return element;
  }

  static async waitForElementTextContains(
    driver: WebDriver,
    locator: By,
    text: string,
    timeoutMs: number = 15000
  ): Promise<WebElement> {
    const element = await this.waitForElementVisible(driver, locator, timeoutMs);
    return driver.wait(until.elementTextContains(element, text), timeoutMs);
  }

  static async waitForUrlContains(
    driver: WebDriver,
    partialUrl: string,
    timeoutMs: number = 15000
  ): Promise<boolean> {
    return driver.wait(until.urlContains(partialUrl), timeoutMs);
  }

  static async safeClick(driver: WebDriver, locator: By, timeoutMs: number = 15000): Promise<void> {
    const element = await this.waitForElementClickable(driver, locator, timeoutMs);
    try {
      await element.click();
    } catch {
      // Fallback to JavaScript native click if overlay intersects
      await driver.executeScript('arguments[0].click();', element);
    }
  }

  static async safeType(
    driver: WebDriver,
    locator: By,
    text: string,
    timeoutMs: number = 15000
  ): Promise<void> {
    const element = await this.waitForElementVisible(driver, locator, timeoutMs);
    await element.clear();
    await element.sendKeys(text);
  }
}
