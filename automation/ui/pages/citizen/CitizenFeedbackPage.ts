import { WebDriver, By } from 'selenium-webdriver';
import { WaitUtils } from '../../utilities/WaitUtils';

export class CitizenFeedbackPage {
  protected driver: WebDriver;

  private starButtons = By.css('button[data-star], .rating-stars button');
  private commentTextarea = By.css('textarea[name="comment"], textarea[placeholder*="feedback"]');
  private confirmCheckbox = By.css('input[type="checkbox"]');
  private submitFeedbackBtn = By.xpath("//button[contains(., 'Submit Review') or contains(., 'Submit Feedback')]");

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  async setRating(stars: number): Promise<void> {
    const starBtns = await this.driver.findElements(this.starButtons);
    if (starBtns[stars - 1]) {
      await starBtns[stars - 1].click();
    }
  }

  async enterComment(comment: string): Promise<void> {
    await WaitUtils.safeType(this.driver, this.commentTextarea, comment);
  }

  async submitFeedback(): Promise<void> {
    await WaitUtils.safeClick(this.driver, this.submitFeedbackBtn);
  }
}
