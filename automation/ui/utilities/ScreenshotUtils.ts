import { WebDriver } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';

export class ScreenshotUtils {
  private static screenshotDir = path.resolve(__dirname, '../../reports/screenshots');

  static async captureScreenshot(driver: WebDriver, testName: string): Promise<string> {
    try {
      if (!fs.existsSync(this.screenshotDir)) {
        fs.mkdirSync(this.screenshotDir, { recursive: true });
      }

      const sanitizedName = testName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `failure_${sanitizedName}_${timestamp}.png`;
      const filepath = path.join(this.screenshotDir, filename);

      const image = await driver.takeScreenshot();
      fs.writeFileSync(filepath, image, 'base64');
      return filepath;
    } catch (error) {
      console.error('Failed to capture test screenshot:', error);
      return '';
    }
  }
}
