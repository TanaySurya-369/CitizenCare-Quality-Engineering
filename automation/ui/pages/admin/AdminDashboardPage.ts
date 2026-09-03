import { WebDriver, By } from 'selenium-webdriver';
import { WaitUtils } from '../../utilities/WaitUtils';

export class AdminDashboardPage {
  protected driver: WebDriver;
  protected baseUrl: string;

  private kpiCards = By.css('.grid > div');
  private slaComplianceRate = By.xpath("//div[contains(., 'SLA Compliance Rate')]");
  private auditLogsTab = By.xpath("//button[contains(., 'Live Audit') or contains(., 'Audit')]");
  private auditRows = By.css('table tbody tr');

  constructor(driver: WebDriver, baseUrl: string = process.env.BASE_URL || 'http://localhost:5173') {
    this.driver = driver;
    this.baseUrl = baseUrl;
  }

  async open(): Promise<void> {
    await this.driver.get(`${this.baseUrl}/admin`);
  }

  async clickAuditLogsTab(): Promise<void> {
    await WaitUtils.safeClick(this.driver, this.auditLogsTab);
  }

  async getAuditRowCount(): Promise<number> {
    const rows = await this.driver.findElements(this.auditRows);
    return rows.length;
  }
}

export class AdminAnalyticsPage {
  protected driver: WebDriver;
  protected baseUrl: string;

  private satisfactionScore = By.xpath("//div[contains(., 'Citizen Satisfaction')]");
  private departmentDistribution = By.xpath("//div[contains(., 'Department Workload')]");

  constructor(driver: WebDriver, baseUrl: string = process.env.BASE_URL || 'http://localhost:5173') {
    this.driver = driver;
    this.baseUrl = baseUrl;
  }

  async open(): Promise<void> {
    await this.driver.get(`${this.baseUrl}/admin`);
  }
}

export class AdminUserManagementPage {
  protected driver: WebDriver;
  protected baseUrl: string;

  private userTable = By.css('table');

  constructor(driver: WebDriver, baseUrl: string = process.env.BASE_URL || 'http://localhost:5173') {
    this.driver = driver;
    this.baseUrl = baseUrl;
  }

  async open(): Promise<void> {
    await this.driver.get(`${this.baseUrl}/admin`);
  }
}
