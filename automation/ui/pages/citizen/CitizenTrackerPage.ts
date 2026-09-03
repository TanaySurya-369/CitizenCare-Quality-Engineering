import { WebDriver, By } from 'selenium-webdriver';
import { WaitUtils } from '../../utilities/WaitUtils';

export class CitizenTrackerPage {
  protected driver: WebDriver;
  protected baseUrl: string;

  private complaintNumberHeading = By.css('h1, [data-testid="complaint-id"]');
  private statusBadge = By.css('[data-testid="status-badge"], span.rounded-full');
  private slaCountdown = By.css('[data-testid="sla-badge"]');
  private timelineSteps = By.css('.timeline-step, [data-testid="timeline-step"]');
  private rateResolutionBtn = By.xpath("//button[contains(., 'Rate Resolution')]");

  constructor(driver: WebDriver, baseUrl: string = process.env.BASE_URL || 'http://localhost:5173') {
    this.driver = driver;
    this.baseUrl = baseUrl;
  }

  async open(complaintId: string): Promise<void> {
    await this.driver.get(`${this.baseUrl}/complaints/${complaintId}`);
  }

  async getComplaintNumber(): Promise<string> {
    const el = await WaitUtils.waitForElementVisible(this.driver, this.complaintNumberHeading);
    return el.getText();
  }

  async clickRateResolution(): Promise<void> {
    await WaitUtils.safeClick(this.driver, this.rateResolutionBtn);
  }
}
