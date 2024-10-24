Feature: Home Page
  As a user
  I want to see the website title on the home page
  So that I know I am on the correct website

  Scenario: User visits the home page
    Given I am on the home page
    Then I should see the website title "My Website"