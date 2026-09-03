import { WebDriver, By } from 'selenium-webdriver';
import { WaitUtils } from '../../utilities/WaitUtils';

export class CitizenRegisterPage {
  protected driver: WebDriver;
  protected baseUrl: string;

  private nameInput = By.css('input[name="name"]');
  private emailInput = By.css('input[name="email"]');
  private passwordInput = By.css('input[name="password"]');
  private phoneInput = By.css('input[name="phone"]');
  private submitButton = By.css('button[type="submit"]');

  constructor(driver: WebDriver, baseUrl: string = process.env.BASE_URL || 'http://localhost:5173') {
    this.driver = driver;
    this.baseUrl = baseUrl;
  }

  async open(): Promise<void> {
    await this.driver.get(`${this.baseUrl}/register`);
  }

  async register(name: string, email: string, pass: string, phone: string = '+1 555-0100'): Promise<void> {
    await WaitUtils.safeType(this.driver, this.nameInput, name);
    await WaitUtils.safeType(this.driver, this.emailInput, email);
    await WaitUtils.safeType(this.driver, this.passwordInput, pass);
    await WaitUtils.safeType(this.driver, this.phoneInput, phone);
    await WaitUtils.safeClick(this.driver, this.submitButton);
  }
}
