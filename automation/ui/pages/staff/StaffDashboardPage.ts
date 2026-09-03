import { WebDriver, By } from 'selenium-webdriver';
import { WaitUtils } from '../../utilities/WaitUtils';

export class StaffDashboardPage {
  protected driver: WebDriver;
  protected baseUrl: string;

  private allQueueTab = By.xpath("//button[contains(., 'All Department Queue')]");
  private assignedToMeTab = By.xpath("//button[contains(., 'Assigned To Me')]");
  private unassignedTab = By.xpath("//button[contains(., 'Unassigned')]");
  private overdueTab = By.xpath("//button[contains(., 'Overdue Breaches')]");
  private complaintRows = By.css('table tbody tr, .grid > div');
  private updateStatusButtons = By.xpath("//button[contains(., 'Update Status')]");
  private assignTechButtons = By.xpath("//button[contains(., 'Assign Tech')]");

  constructor(driver: WebDriver, baseUrl: string = process.env.BASE_URL || 'http://localhost:5173') {
    this.driver = driver;
    this.baseUrl = baseUrl;
  }

  async open(): Promise<void> {
    await this.driver.get(`${this.baseUrl}/staff`);
  }

  async clickAllQueue(): Promise<void> {
    await WaitUtils.safeClick(this.driver, this.allQueueTab);
  }

  async clickAssignedToMe(): Promise<void> {
    await WaitUtils.safeClick(this.driver, this.assignedToMeTab);
  }

  async clickUnassigned(): Promise<void> {
    await WaitUtils.safeClick(this.driver, this.unassignedTab);
  }

  async clickOverdueBreaches(): Promise<void> {
    await WaitUtils.safeClick(this.driver, this.overdueTab);
  }

  async clickFirstUpdateStatus(): Promise<void> {
    await WaitUtils.safeClick(this.driver, this.updateStatusButtons);
  }

  async clickFirstAssignTech(): Promise<void> {
    await WaitUtils.safeClick(this.driver, this.assignTechButtons);
  }
}
