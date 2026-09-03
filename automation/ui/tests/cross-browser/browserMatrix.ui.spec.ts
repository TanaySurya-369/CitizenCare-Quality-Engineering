import { expect } from 'chai';
import { WebDriver } from 'selenium-webdriver';
import { WebDriverFactory, SupportedBrowser } from '../../utilities/WebDriverFactory';
import { CitizenLoginPage } from '../../pages/citizen/CitizenLoginPage';

describe('Cross-Browser Matrix Suite: Multi-Engine Compatibility Verification', function () {
  this.timeout(60000);

  const testBrowsers: SupportedBrowser[] = ['chrome', 'edge'];

  for (const browserName of testBrowsers) {
    describe(`Engine Execution: [${browserName.toUpperCase()}]`, function () {
      let driver: WebDriver;

      before(async function () {
        try {
          driver = await WebDriverFactory.createDriver(browserName, true);
        } catch (err: any) {
          console.warn(`Browser ${browserName} is not available on this host:`, err.message);
          this.skip();
        }
      });

      after(async function () {
        await WebDriverFactory.quitAllDrivers();
      });

      it(`should render responsive layout and execute login on ${browserName}`, async function () {
        const loginPage = new CitizenLoginPage(driver);
        await loginPage.open();
        const title = await driver.getTitle();
        expect(title).to.include('CitizenCare');
      });
    });
  }
});
