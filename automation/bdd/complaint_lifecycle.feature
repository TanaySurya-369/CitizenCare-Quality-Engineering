Feature: Municipal Complaint Lifecycle & Resolution Workflow
  As a registered citizen
  I want to submit and track civic complaints with evidence
  So that municipal service teams can investigate, resolve the issue, and maintain public infrastructure

  Background:
    Given the CitizenCare system is running and database is seeded
    And the municipal department service categories are loaded with SLA terms

  @Smoke @Regression @Critical
  Scenario: Citizen successfully reports a high-priority road pothole
    Given I am logged in as a verified citizen with email "citizen@citizencare.gov"
    When I submit a complaint with the following details:
      | category | Pothole & Asphalt Road Damage           |
      | title    | Severe pothole on Main Avenue Lane 2     |
      | location | Main Avenue & 5th St Crossing, North Ward|
      | priority | HIGH                                    |
    Then the complaint should be created with initial status "SUBMITTED"
    And a unique complaint tracking number matching "C-XXXX" should be generated
    And the expected resolution date should be calculated within 48 hours SLA
    And an in-app notification should be sent to the citizen
    And an audit log record with action "CREATE_COMPLAINT" should be created

  @Regression
  Scenario: Municipal Staff triages and progresses complaint through work orders
    Given a complaint exists with status "SUBMITTED"
    When a municipal staff officer claims and assigns the complaint to the field technician
    Then the complaint status should transition to "ASSIGNED"
    When the technician arrives on site and begins repair
    And updates the complaint status to "IN_PROGRESS" with remarks "Milling and hot-mix patching started"
    Then the status should be updated to "IN_PROGRESS"
    When the technician finishes work and marks status as "RESOLVED"
    Then the resolved timestamp should be recorded
    And the citizen should receive a completion notification

  @Regression
  Scenario: Citizen rates resolved service and confirms closure
    Given the complaint has been marked as "RESOLVED"
    When the citizen inspects the work and submits a 5-star rating with comment "Fixed quickly!"
    Then the feedback should be recorded with rating 5
    And the complaint status should automatically transition to "CLOSED"
    And the municipal satisfaction score should be updated in real time
