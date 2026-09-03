Feature: Dynamic SLA Monitoring & Overdue Breach Detection
  As a city administrator
  I want to automatically monitor complaint resolution SLAs
  So that overdue complaints are flagged for rapid escalation

  Scenario Outline: SLA deadline calculation based on complaint priority
    Given a new complaint is filed with priority "<priority>"
    When the system calculates the expected resolution deadline
    Then the target duration should be exactly <hours> hours

    Examples:
      | priority | hours |
      | CRITICAL | 24    |
      | HIGH     | 48    |
      | MEDIUM   | 72    |
      | LOW      | 168   |

  Scenario: Highlighting overdue complaints in staff and admin queues
    Given an active complaint with priority "HIGH" was created 60 hours ago
    When the staff or admin dashboard loads
    Then the complaint SLA badge should display "BREACHED" with a pulsing alert
    And the complaint should be included in the overdue counter KPI
