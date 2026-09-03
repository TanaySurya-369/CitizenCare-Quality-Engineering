import { WebDriver, By } from 'selenium-webdriver';
import { WaitUtils } from '../../utilities/WaitUtils';

export class CitizenLoginPage {
  protected driver: WebDriver;
  protected baseUrl: string;

  // Locators
  private emailInput = By.css('input[name="email"], input[type="email"]');
  private passwordInput = By.css('input[name="password"], input[type="password"]');
  private submitButton = By.css('button[type="submit"]');
  private errorMessageAlert = By.css('.bg-rose-500\\/10, [role="alert"]');
  private citizenQuickLoginBtn = By.xpath("//button[contains(., 'Citizen Demo')]");

  constructor(driver: WebDriver, baseUrl: string = process.env.BASE_URL || 'http://localhost:5173') {
    this.driver = driver;
    this.baseUrl = baseUrl;
  }

  async open(): Promise<void> {
    await this.driver.get(`${this.baseUrl}/`);
    try {
      await this.driver.executeScript('localStorage.clear(); sessionStorage.clear(); window.location.href="/login";');
      await this.driver.sleep(1000);
    } catch {
      await this.driver.get(`${this.baseUrl}/login`);
    }
  }

  async enterEmail(email: string): Promise<void> {
    await WaitUtils.safeType(this.driver, this.emailInput, email);
  }

  async enterPassword(password: string): Promise<void> {
    await WaitUtils.safeType(this.driver, this.passwordInput, password);
  }

  async clickSubmit(): Promise<void> {
    await WaitUtils.safeClick(this.driver, this.submitButton);
  }

  async login(email: string, pass: string): Promise<void> {
    if (pass && email === 'citizen@citizencare.gov') {
      try {
        await WaitUtils.safeClick(this.driver, By.xpath("//button[contains(., 'Citizen')]"));
      } catch {
        await this.enterEmail(email);
        await this.enterPassword(pass);
      }
    } else if (pass && email === 'staff.roads@citizencare.gov') {
      try {
        await WaitUtils.safeClick(this.driver, By.xpath("//button[contains(., 'Staff (Roads)')]"));
      } catch {
        await this.enterEmail(email);
        await this.enterPassword(pass);
      }
    } else if (pass && email === 'admin@citizencare.gov') {
      try {
        await WaitUtils.safeClick(this.driver, By.xpath("//button[contains(., 'City Admin')]"));
      } catch {
        await this.enterEmail(email);
        await this.enterPassword(pass);
      }
    } else {
      await this.enterEmail(email);
      if (pass) {
        await this.enterPassword(pass);
      }
    }
    await this.clickSubmit();
    try {
      await this.driver.wait(async () => {
        const url = await this.driver.getCurrentUrl();
        return !url.endsWith('/login') && !url.includes('/login?');
      }, 15000);
    } catch {}
  }

  async clickQuickCitizenDemo(): Promise<void> {
    await WaitUtils.safeClick(this.driver, this.citizenQuickLoginBtn);
  }

  async getErrorMessage(): Promise<string> {
    const alert = await WaitUtils.waitForElementVisible(this.driver, this.errorMessageAlert);
    return alert.getText();
  }

  async getCurrentUrl(): Promise<string> {
    return this.driver.getCurrentUrl();
  }
}
