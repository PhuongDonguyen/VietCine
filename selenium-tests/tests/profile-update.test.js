const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');

describe('User Profile Update', function () {
    this.timeout(30000); // Set timeout to 30 seconds
    let driver;

    before(async function () {
        const options = new chrome.Options();
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        // Login once before all tests
        await driver.get('http://localhost:5173/login');

        const emailInput = await driver.wait(until.elementLocated(By.id('email')), 5000);
        await driver.wait(until.elementIsVisible(emailInput), 5000);
        await emailInput.sendKeys('phuongdonguyen03@gmail.com');

        const passwordInput = await driver.wait(until.elementLocated(By.id('password')), 5000);
        await driver.wait(until.elementIsVisible(passwordInput), 5000);
        await passwordInput.sendKeys('xinchaovietnam');

        const loginButton = await driver.wait(
            until.elementLocated(By.css('button[type="submit"]')),
            5000
        );
        await driver.wait(until.elementIsEnabled(loginButton), 5000);
        await loginButton.click();

        await driver.wait(until.urlIs('http://localhost:5173/'), 10000);
    });

    beforeEach(async function () {
        // Navigate to profile page before each test
        await driver.get('http://localhost:5173/profile');
        await driver.wait(until.elementLocated(By.css('[data-testid="profile-title"]')), 10000);
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });

    it('should update user profile successfully', async function () {
        await driver.findElement(By.css('[data-testid="edit-button"]')).click();

        const randomSuffix = Math.floor(Math.random() * 100000);

        const fullNameInput = await driver.findElement(By.css('[data-testid="fullname-input"]'));
        await fullNameInput.clear();
        const newFullName = `Phuong Do Test`;
        await fullNameInput.sendKeys(newFullName);

        const emailInput = await driver.findElement(By.css('[data-testid="email-input"]'));
        await emailInput.clear();
        const newEmail = `phuongdonguyen03.test${randomSuffix}@gmail.com`;
        await emailInput.sendKeys(newEmail);

        const phoneInput = await driver.findElement(By.css('[data-testid="phone-input"]'));
        await phoneInput.clear();
        const newPhone = '0123456789';
        await phoneInput.sendKeys(newPhone);

        const addressInput = await driver.findElement(By.css('[data-testid="address-input"]'));
        await addressInput.clear();
        const newAddress = '123 Test Street, Hanoi';
        await addressInput.sendKeys(newAddress);

        await driver.findElement(By.css('[data-testid="submit-button"]')).click();

        const successMessage = await driver.wait(
            until.elementLocated(By.css('[data-testid="success-message"]')),
            10000
        );
        const successText = await successMessage.getText();
        expect(successText).to.include('Thông tin tài khoản đã được cập nhật thành công');

        await driver.wait(until.elementLocated(By.css('[data-testid="fullname-display"]')), 5000);
        const updatedFullName = await driver.findElement(By.css('[data-testid="fullname-display"]')).getText();
        const updatedEmail = await driver.findElement(By.css('[data-testid="email-display"]')).getText();
        const updatedPhone = await driver.findElement(By.css('[data-testid="phone-display"]')).getText();
        const updatedAddress = await driver.findElement(By.css('[data-testid="address-display"]')).getText();

        expect(updatedFullName).to.equal(newFullName);
        expect(updatedEmail).to.equal(newEmail);
        expect(updatedPhone).to.equal(newPhone);
        expect(updatedAddress).to.equal(newAddress);
    });

    it('should handle invalid email input', async function () {
        await driver.findElement(By.css('[data-testid="edit-button"]')).click();

        const emailInput = await driver.findElement(By.css('[data-testid="email-input"]'));
        await emailInput.clear();
        await emailInput.sendKeys('invalid-email');

        await driver.findElement(By.css('[data-testid="submit-button"]')).click();

        const errorMessage = await driver.wait(
            until.elementLocated(By.css('[data-testid="error-message"]')),
            10000
        );
        const errorText = await errorMessage.getText();
        expect(errorText).to.include('Email không hợp lệ');
    });

    it('should update avatar with valid image', async function () {
        await driver.findElement(By.css('[data-testid="edit-button"]')).click();

        const avatarInput = await driver.findElement(By.css('[data-testid="avatar-input"]'));
        await driver.executeScript("arguments[0].value = '';", avatarInput);

        const testImagePath = path.resolve(__dirname, 'test-image.png');
        await avatarInput.sendKeys(testImagePath);

        await driver.findElement(By.css('[data-testid="submit-button"]')).click();

        const successMessage = await driver.wait(
            until.elementLocated(By.css('[data-testid="success-message"]')),
            10000
        );
        const successText = await successMessage.getText();
        expect(successText).to.include('Thông tin tài khoản đã được cập nhật thành công');

        const avatarImage = await driver.wait(
            until.elementLocated(By.css('[data-testid="avatar-image"]')),
            5000
        );
        const src = await avatarImage.getAttribute('src');
        expect(src).to.exist;
        expect(src).to.not.equal('');
    });

    it('should handle invalid avatar file type', async function () {
        await driver.findElement(By.css('[data-testid="edit-button"]')).click();

        const avatarInput = await driver.findElement(By.css('[data-testid="avatar-input"]'));
        await driver.executeScript("arguments[0].value = '';", avatarInput);

        const invalidFilePath = path.resolve(__dirname, 'invalid-file.txt');
        await avatarInput.sendKeys(invalidFilePath);

        const errorMessage = await driver.wait(
            until.elementLocated(By.css('[data-testid="error-message"]')),
            10000
        );
        const errorText = await errorMessage.getText();
        expect(errorText).to.include('Chỉ hỗ trợ định dạng ảnh JPG, PNG hoặc GIF');
    });
});
