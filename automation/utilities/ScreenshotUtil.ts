import { WebDriver } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { Logger } from './Logger';

export class ScreenshotUtil {
  private static screenshotsDir = path.resolve(__dirname, '../screenshots');

  static ensureDirectoryExists(): void {
    if (!fs.existsSync(this.screenshotsDir)) {
      fs.mkdirSync(this.screenshotsDir, { recursive: true });
    }
  }

  static async captureScreenshot(driver: WebDriver, testName: string): Promise<string | null> {
    try {
      this.ensureDirectoryExists();
      const sanitizedName = testName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `failure_${sanitizedName}_${timestamp}.png`;
      const filePath = path.join(this.screenshotsDir, fileName);

      const imageBase64 = await driver.takeScreenshot();
      fs.writeFileSync(filePath, imageBase64, 'base64');

      Logger.warn(`Automated failure screenshot captured: ${fileName}`, 'ScreenshotUtil');
      return filePath;
    } catch (err: any) {
      Logger.error('Failed to capture screenshot', err, 'ScreenshotUtil');
      return null;
    }
  }
}
