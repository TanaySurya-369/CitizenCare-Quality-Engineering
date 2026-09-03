import { WebDriver, By } from 'selenium-webdriver';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  private readonly nameInput = By.id('register-name-input');
  private readonly emailInput = By.id('register-email-input');
  private readonly phoneInput = By.id('register-phone-input');
  private readonly passwordInput = By.id('register-password-input');
  private readonly submitButton = By.id('register-submit-btn');

  constructor(driver: WebDriver) {
    super(driver);
  }

  async open(): Promise<void> {
    await this.navigateTo('/register');
    await this.waitForElementVisible(this.nameInput);
  }

  async fillRegistrationForm(data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }): Promise<void> {
    await this.type(this.nameInput, data.name, 'Full Name');
    await this.type(this.emailInput, data.email, 'Email');
    if (data.phone) {
      await this.type(this.phoneInput, data.phone, 'Phone');
    }
    await this.type(this.passwordInput, data.password, 'Password');
  }

  async clickRegister(): Promise<void> {
    await this.click(this.submitButton, 'Register Submit Button');
  }
}
