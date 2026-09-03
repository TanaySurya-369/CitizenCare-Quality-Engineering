import { WebDriver, By, WebElement } from 'selenium-webdriver';
import { WaitUtils } from '../../utilities/WaitUtils';

export class CitizenDashboardPage {
  protected driver: WebDriver;
  protected baseUrl: string;

  private newComplaintBtn = By.css('#new-complaint-btn, a[href="/complaints/new"]');
  private searchInput = By.css('input[placeholder*="Search"]');
  private complaintCards = By.css('.grid > div');
  private userAvatar = By.css('[data-testid="user-menu"], button[aria-haspopup="menu"]');

  constructor(driver: WebDriver, baseUrl: string = process.env.BASE_URL || 'http://localhost:5173') {
    this.driver = driver;
    this.baseUrl = baseUrl;
  }

  async open(): Promise<void> {
    await this.driver.get(`${this.baseUrl}/citizen`);
  }

  async clickNewComplaint(): Promise<void> {
    await WaitUtils.safeClick(this.driver, this.newComplaintBtn);
  }

  async searchComplaints(keyword: string): Promise<void> {
    await WaitUtils.safeType(this.driver, this.searchInput, keyword);
  }

  async getComplaintCardsCount(): Promise<number> {
    const cards = await this.driver.findElements(this.complaintCards);
    return cards.length;
  }
}
