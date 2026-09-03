import { expect } from 'chai';
import { WebDriver } from 'selenium-webdriver';
import { WebDriverFactory } from '../../utilities/WebDriverFactory';
import { CitizenLoginPage } from '../../pages/citizen/CitizenLoginPage';

describe('Selenium UI Sanity Suite: Critical Path Validation', function () {
  this.timeout(45000);
  let driver: WebDriver;

  before(async function () {
    try {
      driver = await WebDriverFactory.createDriver('chrome', true);
    } catch (err: any) {
      console.warn('Browser initialization notice in sanity suite:', err.message);
      this.skip();
    }
  });

  after(async function () {
    await WebDriverFactory.quitAllDrivers();
  });

  it('@Sanity Application renders and navigates to CitizenCare login without errors', async function () {
    const loginPage = new CitizenLoginPage(driver);
    await loginPage.open();
    const title = await driver.getTitle();
    expect(title).to.include('CitizenCare');
  });

  it('@Sanity Rejects empty password submission gracefully', async function () {
    const loginPage = new CitizenLoginPage(driver);
    await loginPage.open();
    await loginPage.login('citizen@citizencare.gov', '');
    const currentUrl = await loginPage.getCurrentUrl();
    expect(currentUrl).to.include('/login');
  });
});
