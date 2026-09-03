import { WebDriver, By } from 'selenium-webdriver';
import { BasePage } from './BasePage';

export class NewComplaintPage extends BasePage {
  private readonly titleInput = By.id('complaint-title-input');
  private readonly descInput = By.id('complaint-desc-input');
  private readonly locationInput = By.id('complaint-location-input');
  private readonly submitButton = By.id('submit-complaint-btn');

  constructor(driver: WebDriver) {
    super(driver);
  }

  async open(): Promise<void> {
    await this.navigateTo('/complaints/new');
    await this.waitForElementVisible(this.titleInput);
  }

  async fillComplaintForm(data: {
    title: string;
    description: string;
    location: string;
  }): Promise<void> {
    await this.type(this.titleInput, data.title, 'Title');
    await this.type(this.descInput, data.description, 'Description');
    await this.type(this.locationInput, data.location, 'Location');
  }

  async submitComplaint(): Promise<void> {
    await this.click(this.submitButton, 'Submit Civic Complaint Button');
  }
}
