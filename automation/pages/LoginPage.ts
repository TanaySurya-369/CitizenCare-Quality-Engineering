import { WebDriver, By } from 'selenium-webdriver';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Locators
  private readonly emailInput = By.id('login-email-input');
  private readonly passwordInput = By.id('login-password-input');
  private readonly submitButton = By.id('login-submit-btn');
  private readonly errorMessage = By.css('.bg-rose-500\\/15');

  constructor(driver: WebDriver) {
    super(driver);
  }

  async open(): Promise<void> {
    await this.navigateTo('/login');
    await this.waitForElementVisible(this.emailInput);
  }

  async enterEmail(email: string): Promise<void> {
    await this.type(this.emailInput, email, `Email: ${email}`);
  }

  async enterPassword(password: string): Promise<void> {
    await this.type(this.passwordInput, password, 'Password input');
  }

  async clickLogin(): Promise<void> {
    await this.click(this.submitButton, 'Login Submit Button');
  }

  async login(email: string, pass: string): Promise<void> {
    await this.enterEmail(email);
    await this.enterPassword(pass);
    await this.clickLogin();
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }
}
