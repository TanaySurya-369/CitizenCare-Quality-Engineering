import { WebDriver, By } from 'selenium-webdriver';
import { BasePage } from './BasePage';

export class ComplaintDetailPage extends BasePage {
  private readonly rateServiceBtn = By.id('rate-service-btn');
  private readonly updateStatusBtn = By.id('update-status-btn');
  private readonly assignStaffBtn = By.id('assign-staff-btn');

  constructor(driver: WebDriver) {
    super(driver);
  }

  async open(complaintId: string): Promise<void> {
    await this.navigateTo(`/complaints/${complaintId}`);
  }

  async clickRateService(): Promise<void> {
    await this.click(this.rateServiceBtn, 'Rate Service Button');
  }

  async clickUpdateStatus(): Promise<void> {
    await this.click(this.updateStatusBtn, 'Update Status Button');
  }

  async clickAssignStaff(): Promise<void> {
    await this.click(this.assignStaffBtn, 'Assign Staff Button');
  }
}
