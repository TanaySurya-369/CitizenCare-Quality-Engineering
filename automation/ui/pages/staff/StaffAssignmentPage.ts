import { WebDriver, By } from 'selenium-webdriver';
import { WaitUtils } from '../../utilities/WaitUtils';

export class StaffAssignmentPage {
  protected driver: WebDriver;

  private staffSelect = By.css('select[name="staffId"], select');
  private notesInput = By.css('textarea[name="notes"], textarea');
  private confirmAssignBtn = By.xpath("//button[contains(., 'Confirm Assignment')]");

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  async selectTechnician(technicianId: string): Promise<void> {
    const selectEl = await WaitUtils.waitForElementVisible(this.driver, this.staffSelect);
    await selectEl.sendKeys(technicianId);
  }

  async enterNotes(notes: string): Promise<void> {
    await WaitUtils.safeType(this.driver, this.notesInput, notes);
  }

  async confirmAssignment(): Promise<void> {
    await WaitUtils.safeClick(this.driver, this.confirmAssignBtn);
  }
}

export class StaffResolutionPage {
  protected driver: WebDriver;

  private statusSelect = By.css('select[name="status"], select');
  private remarksInput = By.css('textarea[name="remarks"], textarea');
  private confirmUpdateBtn = By.xpath("//button[contains(., 'Update Status') or contains(., 'Confirm')]");

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  async selectStatus(status: string): Promise<void> {
    const selectEl = await WaitUtils.waitForElementVisible(this.driver, this.statusSelect);
    await selectEl.sendKeys(status);
  }

  async enterRemarks(remarks: string): Promise<void> {
    await WaitUtils.safeType(this.driver, this.remarksInput, remarks);
  }

  async confirmUpdate(): Promise<void> {
    await WaitUtils.safeClick(this.driver, this.confirmUpdateBtn);
  }
}
