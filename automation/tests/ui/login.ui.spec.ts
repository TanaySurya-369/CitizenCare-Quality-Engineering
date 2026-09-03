import { expect } from 'chai';
import { WebDriver } from 'selenium-webdriver';
import { DriverManager } from '../../utilities/DriverManager';
import { LoginPage } from '../../pages/LoginPage';
import { TestDataManager } from '../../utilities/TestDataManager';
import { ScreenshotUtil } from '../../utilities/ScreenshotUtil';

describe('Selenium UI Test Suite: Authentication & POM Form Validation', function () {
  this.timeout(60000);
  let driver: WebDriver;
  let loginPage: LoginPage;
  const users = TestDataManager.getUsers();

  before(async function () {
    try {
      driver = await DriverManager.getDriver();
      loginPage = new LoginPage(driver);
    } catch (err: any) {
      console.warn('Browser initialization notice:', err.message);
      this.skip();
    }
  });

  after(async function () {
    await DriverManager.quitDriver();
  });

  afterEach(async function () {
    if (this.currentTest && this.currentTest.state === 'failed' && driver) {
      await ScreenshotUtil.captureScreenshot(driver, this.currentTest.title);
    }
  });

  it('should navigate to login page and render form elements', async function () {
    await loginPage.open();
    const title = await loginPage.getPageTitle();
    expect(title).to.include('CitizenCare');
  });

  it('should reject invalid password credentials and display visual error alert', async function () {
    await loginPage.open();
    await loginPage.login(users.validUsers.citizen.email, 'WrongPassword!999');
    const errMsg = await loginPage.getErrorMessage();
    expect(errMsg).to.include('Invalid email or password');
  });

  it('should successfully log in as Citizen and navigate to citizen dashboard', async function () {
    await loginPage.open();
    await loginPage.login(users.validUsers.citizen.email, users.validUsers.citizen.password);
    
    // Wait for redirect to /citizen
    await driver.sleep(1500);
    const currentUrl = await loginPage.getCurrentUrl();
    expect(currentUrl).to.include('/citizen');
  });
});
