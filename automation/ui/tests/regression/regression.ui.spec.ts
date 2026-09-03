import { expect } from 'chai';
import { WebDriver } from 'selenium-webdriver';
import { WebDriverFactory } from '../../utilities/WebDriverFactory';
import { CitizenLoginPage } from '../../pages/citizen/CitizenLoginPage';
import { CitizenDashboardPage } from '../../pages/citizen/CitizenDashboardPage';
import { CitizenComplaintPage } from '../../pages/citizen/CitizenComplaintPage';
import { StaffDashboardPage } from '../../pages/staff/StaffDashboardPage';
import { AdminDashboardPage } from '../../pages/admin/AdminDashboardPage';
import { ScreenshotUtils } from '../../utilities/ScreenshotUtils';

describe('Selenium UI Regression Suite: Multi-Role Civic Management', function () {
  this.timeout(60000);
  let driver: WebDriver;

  before(async function () {
    try {
      driver = await WebDriverFactory.createDriver('chrome', true);
    } catch (err: any) {
      console.warn('Browser initialization notice in regression suite:', err.message);
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

  it('@Regression Citizen files a high-priority civic work order', async function () {
    const loginPage = new CitizenLoginPage(driver);
    const complaintPage = new CitizenComplaintPage(driver);

    await loginPage.open();
    await loginPage.login('citizen@citizencare.gov', 'Citizen@123');
    await driver.sleep(1500);

    await complaintPage.open();
    await complaintPage.fillComplaintForm(
      'Automated UI Test: Damaged Manhole Lid',
      'Manhole cover on sidewalk is cracked and moving under pedestrian weight.',
      'Broadway & 72nd St'
    );
    await complaintPage.submitComplaint();
    await driver.sleep(2500);

    const url = await driver.getCurrentUrl();
    expect(url).to.match(/(\/complaints\/|\/citizen)/);
  });

  it('@Regression Municipal Staff reviews triage queue and applies filters', async function () {
    const loginPage = new CitizenLoginPage(driver);
    const staffPage = new StaffDashboardPage(driver);

    await loginPage.open();
    await loginPage.login('staff.roads@citizencare.gov', 'Staff@123');
    await driver.sleep(1500);

    await staffPage.open();
    await staffPage.clickAllQueue();
    await staffPage.clickUnassigned();
    await staffPage.clickOverdueBreaches();
  });

  it('@Regression City Administrator inspects city KPIs and audit stream', async function () {
    const loginPage = new CitizenLoginPage(driver);
    const adminPage = new AdminDashboardPage(driver);

    await loginPage.open();
    await loginPage.login('admin@citizencare.gov', 'Admin@123');
    await driver.sleep(1500);

    await adminPage.open();
    await adminPage.clickAuditLogsTab();
    const rows = await adminPage.getAuditRowCount();
    expect(rows).to.be.greaterThan(0);
  });
});
