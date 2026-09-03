import { WebDriver, By } from 'selenium-webdriver';
import { BasePage } from './BasePage';

export class StaffDashboardPage extends BasePage {
  private readonly searchInput = By.id('staff-search-input');
  private readonly complaintCards = By.css('.glass-panel');

  constructor(driver: WebDriver) {
    super(driver);
  }

  async open(): Promise<void> {
    await this.navigateTo('/staff');
    await this.waitForElementVisible(this.searchInput);
  }

  async searchQueue(term: string): Promise<void> {
    await this.type(this.searchInput, term, `Queue Search: ${term}`);
  }
}
