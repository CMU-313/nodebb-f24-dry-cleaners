const { Given, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');

let driver;

Given('I am on the home page', async function () {
  driver = await new Builder().forBrowser('chrome').build();
  await driver.get('http://localhost:4567'); // Replace with your actual home page URL
});

Then('I should see {string}', async function (expectedText) {
  const element = await driver.wait(until.elementLocated(By.tagName('body')), 10000);
  const bodyText = await element.getText();
  assert(bodyText.includes(expectedText), `Expected to see "${expectedText}", but got "${bodyText}"`);
  await driver.quit();
});