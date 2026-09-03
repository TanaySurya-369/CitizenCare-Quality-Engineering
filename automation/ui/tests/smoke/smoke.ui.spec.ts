import { expect } from 'chai';
import { WebDriver } from 'selenium-webdriver';
import { WebDriverFactory } from '../../utilities/WebDriverFactory';
import { CitizenLoginPage } from '../../pages/citizen/CitizenLoginPage';
import { CitizenDashboardPage } from '../../pages/citizen/CitizenDashboardPage';
import { ScreenshotUtils } from '../../utilities/ScreenshotUtils';

describe('Selenium UI Smoke Suite: Core Authentication & Dashboard Flow', function () {
  this.timeout(60000);
  let driver: WebDriver;
  let loginPage: CitizenLoginPage;
  let dashboardPage: CitizenDashboardPage;

  before(async function () {
    try {
      driver = await WebDriverFactory.createDriver('chrome', true);
      loginPage = new CitizenLoginPage(driver);
      dashboardPage = new CitizenDashboardPage(driver);
    } catch (err: any) {
      console.warn('Browser initialization notice in smoke suite:', err.message);
      this.skip();
    }
  });

  after(async function () {
    await WebDriverFactory.quitAllDrivers();
  });

  afterEach(async function () {
    if (this.currentTest && this.currentTest.state === 'failed' && driver) {
      await ScreenshotUtils.captureScreenshot(driver, this.currentTest.title);
    }
  });

  it('@Smoke should render CitizenCare landing & login interface cleanly', async function () {
    await loginPage.open();
    const currentUrl = await loginPage.getCurrentUrl();
    expect(currentUrl).to.include('/login');
  });

  it('@Smoke should authenticate citizen and load citizen dashboard metrics', async function () {
    await loginPage.open();
    await loginPage.login('citizen@citizencare.gov', 'Citizen@123');
    await driver.sleep(1500);

    const currentUrl = await loginPage.getCurrentUrl();
    expect(currentUrl).to.include('/citizen');

    const cardCount = await dashboardPage.getComplaintCardsCount();
    expect(cardCount).to.be.greaterThan(0);
  });
});
