const { expect } = require('chai');
const { By, until } = require('selenium-webdriver');
const { user, updatedUser, invalidUser } = require('../utils/testData');

describe('Profile Page Tests', function () {
    this.timeout(15000); // Set timeout for all tests in this suite

    beforeEach(async function () {
        await driver.get('http://localhost:5173/profile');
        await driver.manage().window().maximize();
    });

    it('should load profile page successfully', async function () {
        const title = await driver.findElement(By.css('[data-testid="profile-title"]')).getText();
        expect(title).to.equal('Tài khoản của tôi');
    });

    it('should display user information correctly', async function () {
        const fullName = await driver.findElement(By.css('[data-testid="user-fullname"]')).getText();
        const email = await driver.findElement(By.css('[data-testid="user-email"]')).getText();
        expect(fullName).to.not.be.empty;
        expect(email).to.not.be.empty;
    });

    it('should allow editing and updating user profile', async function () {
        // Click edit button
        await driver.findElement(By.css('[data-testid="edit-button"]')).click();

        // Fill form
        const fullNameInput = await driver.findElement(By.css('[data-testid="fullname-input"]'));
        const emailInput = await driver.findElement(By.css('[data-testid="email-input"]'));
        const phoneInput = await driver.findElement(By.css('[data-testid="phone-input"]'));
        const addressInput = await driver.findElement(By.css('[data-testid="address-input"]'));

        await fullNameInput.clear();
        await fullNameInput.sendKeys(updatedUser.fullName);
        await emailInput.clear();
        await emailInput.sendKeys(updatedUser.email);
        await phoneInput.clear();
        await phoneInput.sendKeys(updatedUser.phone);
        await addressInput.clear();
        await addressInput.sendKeys(updatedUser.address);

        // Submit form
        await driver.findElement(By.css('[data-testid="submit-button"]')).click();

        // Wait for success message
        const successMessage = await driver.wait(
            until.elementLocated(By.css('[data-testid="success-message"]')),
            5000
        );
        const messageText = await successMessage.getText();
        expect(messageText).to.include('Thông tin tài khoản đã được cập cập thành công');
    });

    it('should show error for invalid email', async function () {
        // Click edit button
        await driver.findElement(By.css('[data-testid="edit-button"]')).click();

        // Fill form with invalid email
        const emailInput = await driver.findElement(By.css('[data-testid="email-input"]'));
        await emailInput.clear();
        await emailInput.sendKeys(invalidUser.email);

        // Submit form
        await driver.findElement(By.css('[data-testid="submit-button"]')).click();

        // Wait for error message
        const errorMessage = await driver.wait(
            until.elementLocated(By.css('[data-testid="error-message"]')),
            5000
        );
        const messageText = await errorMessage.getText();
        expect(messageText).to.include('Email không hợp lệ');
    });

    it('should show error for invalid name', async function () {
        // Click edit button
        await driver.findElement(By.css('[data-testid="edit-button"]')).click();

        // Fill form with invalid name
        const fullNameInput = await driver.findElement(By.css('[data-testid="fullname-input"]'));
        await fullNameInput.clear();
        await fullNameInput.sendKeys(invalidUser.fullName);

        // Submit form
        await driver.findElement(By.css('[data-testid="submit-button"]')).click();

        // Wait for error message
        const errorMessage = await driver.wait(
            until.elementLocated(By.css('[data-testid="error-message"]')),
            5000
        );
        const messageText = await errorMessage.getText();
        expect(messageText).to.include('Tên không được chứa ký tự đặc biệt hoặc số');
    });

    it('should allow avatar upload', async function () {
        // Click edit button
        await driver.findElement(By.css('[data-testid="edit-button"]')).click();

        // Upload avatar
        const avatarInput = await driver.findElement(By.css('[data-testid="avatar-input"]'));
        await avatarInput.sendKeys('/path/to/test-image.png'); // Replace with actual path to a test image

        // Submit form
        await driver.findElement(By.css('[data-testid="submit-button"]')).click();

        // Wait for success message
        const successMessage = await driver.wait(
            until.elementLocated(By.css('[data-testid="success-message"]')),
            5000
        );
        const messageText = await successMessage.getText();
        expect(messageText).to.include('Thông tin tài khoản đã được cập nhật thành công');
    });
});