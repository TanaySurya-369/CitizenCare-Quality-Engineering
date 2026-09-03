import { WebDriver, By } from 'selenium-webdriver';
import { WaitUtils } from '../../utilities/WaitUtils';

export class CitizenComplaintPage {
  protected driver: WebDriver;
  protected baseUrl: string;

  private titleInput = By.css('#complaint-title-input, input[name="title"], input[placeholder*="pothole"]');
  private descriptionInput = By.css('#complaint-desc-input, textarea[name="description"]');
  private locationInput = By.css('#complaint-location-input, input[name="location"]');
  private categorySelect = By.css('select[name="categoryId"]');
  private submitButton = By.css('button[type="submit"]');

  constructor(driver: WebDriver, baseUrl: string = process.env.BASE_URL || 'http://localhost:5173') {
    this.driver = driver;
    this.baseUrl = baseUrl;
  }

  async open(): Promise<void> {
    await this.driver.get(`${this.baseUrl}/complaints/new`);
  }

  async fillComplaintForm(title: string, description: string, location: string): Promise<void> {
    await WaitUtils.safeType(this.driver, this.titleInput, title);
    await WaitUtils.safeType(this.driver, this.descriptionInput, description);
    await WaitUtils.safeType(this.driver, this.locationInput, location);
  }

  async submitComplaint(): Promise<void> {
    await WaitUtils.safeClick(this.driver, this.submitButton);
  }
}
