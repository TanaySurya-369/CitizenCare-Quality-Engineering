import { WebDriver, By, until } from 'selenium-webdriver';
import { BasePage } from './BasePage';

export class CitizenDashboardPage extends BasePage {
  private readonly newComplaintButton = By.id('new-complaint-btn');
  private readonly searchInput = By.id('citizen-search-input');
  private readonly complaintCards = By.css('.glass-panel');

  constructor(driver: WebDriver) {
    super(driver);
  }

  async open(): Promise<void> {
    await this.navigateTo('/citizen');
    await this.waitForElementVisible(this.newComplaintButton);
  }

  async clickReportNewProblem(): Promise<void> {
    await this.click(this.newComplaintButton, 'Report New Problem Button');
  }

  async searchComplaints(term: string): Promise<void> {
    await this.type(this.searchInput, term, `Search: ${term}`);
  }

  async getComplaintCount(): Promise<number> {
    const elements = await this.driver.findElements(this.complaintCards);
    return elements.length;
  }
}
