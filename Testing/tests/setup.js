const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

let driver;

before(async function () {
    const options = new chrome.Options();
    options.addArguments('--headless'); // Run in headless mode for CI
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    // Make driver globally available for tests
    global.driver = driver;
});

after(async function () {
    if (driver) {
        await driver.quit();
    }
});