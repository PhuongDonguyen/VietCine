const { Builder, By, until } = require("selenium-webdriver");
const { expect } = require("chai");

const BASE_URL = "http://localhost:5173";
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

describe("User flow: Đăng ký, đăng xuất, đăng nhập lại, cập nhật thông tin cá nhân", function () {
  this.timeout(90000);
  let driver;

  beforeEach(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  afterEach(async () => {
    if (driver) await driver.quit();
  });

  it("Đăng ký, đăng xuất, đăng nhập lại, cập nhật thông tin cá nhân", async () => {
    // Đăng ký tài khoản mới
    await driver.get(BASE_URL + "/signup");
    await driver.wait(until.elementLocated(By.name("fullName")), 10000);
    await driver.findElement(By.name("fullName")).sendKeys("Hồ Văn Phú");
    await driver
      .findElement(By.name("email"))
      .sendKeys("hovanphu050@gmail.com");
    await driver.findElement(By.name("phone")).sendKeys("0966802000");
    await driver
      .findElement(By.name("address"))
      .sendKeys("123 Đường Selenium, Quận 1, TP.HCM");
    await driver.findElement(By.name("password")).sendKeys("testpassword1");
    await driver
      .findElement(By.name("confirmPassword"))
      .sendKeys("testpassword1");
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Đăng xuất
    await delay(1500);
    await driver.wait(
      until.elementLocated(By.css('[data-testid="profile-title"]')),
      10000
    );
    await driver.findElement(By.css('[data-testid="profile-title"]')).click();
    await delay(800);
    await driver
      .findElement(By.css('button[data-testid="logout-btn"]'))
      .click();
    await delay(1000);
    await driver.wait(until.urlIs(BASE_URL + "/"), 10000);

    // Đăng nhập lại: chỉ bấm login-navbar-btn một lần, rồi điền thông tin
    await driver
      .findElement(By.css('[data-testid="login-navbar-btn"]'))
      .click();
    await driver.wait(until.urlContains("/login"), 10000);
    await driver
      .findElement(By.name("email"))
      .sendKeys("hovanphu050@gmail.com");
    await driver.findElement(By.name("password")).sendKeys("testpassword1");
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlIs(BASE_URL + "/"), 10000);
    await delay(1500);

    // Vào trang profile
    await driver.wait(
      until.elementLocated(By.css('[data-testid="profile-title"]')),
      10000
    );
    await driver.findElement(By.css('[data-testid="profile-title"]')).click();
    await delay(800);
    await driver
      .findElement(By.css('button[data-testid="profile-account-btn"]'))
      .click();
    await driver.wait(until.urlContains("/profile"), 10000);
    await driver.wait(
      until.elementLocated(By.css('[data-testid="edit-button"]')),
      10000
    );
    await delay(750);
    await driver.findElement(By.css('[data-testid="edit-button"]')).click();
    await delay(750);

    // Cập nhật thông tin mới
    const newName = "Hồ Văn Phú Selenium";
    const newPhone = "0987654322";
    const newEmail = "hovanphu051@gmail.com";
    const newAddress = "456 Đường Automation, Quận 2, TP.HCM";
    await driver.findElement(By.css('[data-testid="fullname-input"]')).clear();
    await driver
      .findElement(By.css('[data-testid="fullname-input"]'))
      .sendKeys(newName);
    await driver.findElement(By.css('[data-testid="email-input"]')).clear();
    await driver
      .findElement(By.css('[data-testid="email-input"]'))
      .sendKeys(newEmail);
    await driver.findElement(By.css('[data-testid="phone-input"]')).clear();
    await driver
      .findElement(By.css('[data-testid="phone-input"]'))
      .sendKeys(newPhone);
    await driver.findElement(By.css('[data-testid="address-input"]')).clear();
    await driver
      .findElement(By.css('[data-testid="address-input"]'))
      .sendKeys(newAddress);
    await delay(750);
    await driver.findElement(By.css('[data-testid="submit-button"]')).click();
    await delay(3000); // Chờ 3s rồi kết thúc
  });
});
