const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const path = require('path');

describe('Kiểm Thử Trang profile', function () {
    this.timeout(30000);
    let driver;

    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
        console.log('Đang điều hướng đến trang Profile...');
        await driver.get('http://localhost:5173/profile');
        try {
            await driver.wait(until.elementLocated(By.css('[data-testid="profile-title"]')), 10000);
            console.log('Trang profile đã tải thành công');
        } catch (error) {
            console.error('Không thể tải trang profile:', error);
            const pageSource = await driver.getPageSource();
            console.log('Nguồn trang:', pageSource.substring(0, 500)); // Ghi lại 500 ký tự đầu tiên để debug
            throw error;
        }
    });

    after(async function () {
        console.log('Cleaning...');
        await driver.quit();
    });

    // Hàm đặt lại trạng thái để đảm bảo trạng thái nhất quán trước mỗi bài kiểm thử
    async function resetProfileState() {
        console.log('Đang đặt lại trạng thái profile...');
        try {
            const cancelElements = await driver.findElements(By.css('[data-testid="cancel-button"]'));
            if (cancelElements.length > 0) {
                console.log('Tìm thấy nút hủy, nhấp để thoát chế độ chỉnh sửa');
                await cancelElements[0].click();
                await driver.wait(until.elementLocated(By.css('[data-testid="edit-button"]')), 5000);
            }

            const errorElements = await driver.findElements(By.css('[data-testid="error-message"]'));
            if (errorElements.length > 0 || cancelElements.length === 0) {
                console.log('Đang làm mới trang để đặt lại hoàn toàn');
                await driver.navigate().refresh();
                await driver.wait(until.elementLocated(By.css('[data-testid="profile-title"]')), 10000);
            }

            console.log('Đặt lại trạng thái profile thành công');
        } catch (error) {
            console.error('Lỗi khi đặt lại trạng thái, buộc làm mới:', error);
            await driver.navigate().refresh();
            await driver.wait(until.elementLocated(By.css('[data-testid="profile-title"]')), 10000);
        }
    }

    beforeEach(async function () {
        await resetProfileState();
    });

    async function enterEditMode() {
        console.log('Đang vào chế độ chỉnh sửa...');
        try {
            const inputElements = await driver.findElements(By.css('[data-testid="fullname-input"]'));
            if (inputElements.length > 0) {
                console.log('Đã ở chế độ chỉnh sửa, bỏ qua nhấp nút chỉnh sửa');
                return;
            }

            await driver.takeScreenshot().then(
                data => require('fs').writeFileSync(`trước-chỉnh-sửa-${Date.now()}.png`, data, 'base64')
            );

            const editButton = await driver.wait(until.elementLocated(By.css('[data-testid="edit-button"]')), 5000);
            await editButton.click();
            await driver.wait(until.elementLocated(By.css('[data-testid="fullname-input"]')), 5000);
            console.log('Đã vào chế độ chỉnh sửa');
        } catch (error) {
            console.error('Lỗi khi vào chế độ chỉnh sửa:', error);
            await driver.takeScreenshot().then(
                data => require('fs').writeFileSync(`lỗi-chỉnh-sửa-${Date.now()}.png`, data, 'base64')
            );
            const pageSource = await driver.getPageSource();
            console.log('Trạng thái trang hiện tại:', pageSource.substring(0, 500));
            throw error;
        }
    }

    // Trường hợp kiểm thử 1: Cập nhật hồ sơ thành công
    it('Cập nhật profile thành công với dữ liệu hợp lệ', async function () {
        await enterEditMode();
        const fullNameInput = await driver.findElement(By.css('[data-testid="fullname-input"]'));
        await fullNameInput.clear();
        await fullNameInput.sendKeys('Hồ Văn Phú Mới');
        const emailInput = await driver.findElement(By.css('[data-testid="email-input"]'));
        await emailInput.clear();
        await emailInput.sendKeys('newemail@example.com');
        await driver.findElement(By.css('[data-testid="submit-button"]')).click();

        await driver.wait(until.elementLocated(By.css('[data-testid="success-message"]')), 10000);
        const successMessage = await driver.findElement(By.css('[data-testid="success-message"]')).getText();
        const updatedFullName = await driver.findElement(By.css('[data-testid="user-fullname"]')).getText();
        expect(successMessage).to.include('Thông tin tài khoản đã được cập nhật thành công');
        expect(updatedFullName).to.equal('Hồ Văn Phú Mới');
    });

    // Trường hợp kiểm thử 2: Xác thực trường - Email không hợp lệ
    it('Hiển thị lỗi cho email không hợp lệ', async function () {
        await enterEditMode();
        const emailInput = await driver.findElement(By.css('[data-testid="email-input"]'));
        await emailInput.clear();
        await emailInput.sendKeys('test@com');

        const fullNameInput = await driver.findElement(By.css('[data-testid="fullname-input"]'));
        if (!(await fullNameInput.getAttribute('value'))) {
            await fullNameInput.sendKeys('Test User');
        }

        const phoneInput = await driver.findElement(By.css('[data-testid="phone-input"]'));
        if (!(await phoneInput.getAttribute('value'))) {
            await phoneInput.sendKeys('1234567890');
        }

        const usernameInput = await driver.findElement(By.css('[data-testid="username-input"]'));
        if (!(await usernameInput.getAttribute('value'))) {
            await usernameInput.sendKeys('testuser');
        }

        await driver.findElement(By.css('[data-testid="submit-button"]')).click();
        await driver.wait(until.elementLocated(By.css('[data-testid="error-message"]')), 5000);
        const errorMessage = await driver.findElement(By.css('[data-testid="error-message"]')).getText();
        expect(errorMessage).to.include('Email không hợp lệ');

        await driver.findElement(By.css('[data-testid="cancel-button"]')).click();
    });

    // Trường hợp kiểm thử 3: Xác thực trường - Tên có ký tự đặc biệt
    it('Hiển thị lỗi cho tên có ký tự đặc biệt', async function () {
        await enterEditMode();
        const fullNameInput = await driver.findElement(By.css('[data-testid="fullname-input"]'));
        await fullNameInput.clear();
        await fullNameInput.sendKeys('Hồ Văn Phú @123');

        const emailInput = await driver.findElement(By.css('[data-testid="email-input"]'));
        if (!(await emailInput.getAttribute('value'))) {
            await emailInput.sendKeys('valid@example.com');
        }

        await driver.findElement(By.css('[data-testid="submit-button"]')).click();
        await driver.wait(until.elementLocated(By.css('[data-testid="error-message"]')), 5000);
        const errorMessage = await driver.findElement(By.css('[data-testid="error-message"]')).getText();
        expect(errorMessage).to.include('Tên không được chứa ký tự đặc biệt hoặc số');

        await driver.findElement(By.css('[data-testid="cancel-button"]')).click();
    });

    // Trường hợp kiểm thử 4: Tải lên ảnh đại diện - Ảnh hợp lệ
    it('Tải lên ảnh đại diện hợp lệ thành công', async function () {
        await enterEditMode();
        const avatarInput = await driver.findElement(By.css('[data-testid="avatar-input"]'));
        const testImagePath = path.resolve(__dirname, 'test-image.jpg');
        console.log(`Sử dụng ảnh thử nghiệm tại: ${testImagePath}`);

        await avatarInput.sendKeys(testImagePath);
        await driver.findElement(By.css('[data-testid="submit-button"]')).click();
        await driver.wait(until.elementLocated(By.css('[data-testid="success-message"]')), 10000);
        const successMessage = await driver.findElement(By.css('[data-testid="success-message"]')).getText();
        expect(successMessage).to.include('Thông tin tài khoản đã được cập nhật thành công');
    });

    // Trường hợp kiểm thử 5: Tải lên ảnh đại diện - Định dạng không hợp lệ
    it('Hiển thị lỗi cho định dạng ảnh đại diện không hợp lệ', async function () {
        await enterEditMode();
        const avatarInput = await driver.findElement(By.css('[data-testid="avatar-input"]'));
        const testFilePath = path.resolve(__dirname, 'test-file.txt');
        console.log(`Sử dụng tệp thử nghiệm tại: ${testFilePath}`);

        await avatarInput.sendKeys(testFilePath);
        await driver.wait(until.elementLocated(By.css('[data-testid="error-message"]')), 5000);
        const errorMessage = await driver.findElement(By.css('[data-testid="error-message"]')).getText();
        expect(errorMessage).to.include('Chỉ hỗ trợ định dạng ảnh JPG, PNG hoặc GIF');

        await driver.findElement(By.css('[data-testid="cancel-button"]')).click();
    });

    // Trường hợp kiểm thử 6: Tải lên ảnh đại diện - Vượt quá giới hạn kích thước
    it('Hiển thị lỗi cho ảnh đại diện vượt quá giới hạn kích thước', async function () {
        await enterEditMode();
        const avatarInput = await driver.findElement(By.css('[data-testid="avatar-input"]'));
        const largeImagePath = path.resolve(__dirname, 'large-image.jpg');
        console.log(`Sử dụng ảnh lớn tại: ${largeImagePath}`);

        await avatarInput.sendKeys(largeImagePath);
        await driver.wait(until.elementLocated(By.css('[data-testid="error-message"]')), 5000);
        const errorMessage = await driver.findElement(By.css('[data-testid="error-message"]')).getText();
        expect(errorMessage).to.include('Kích thước ảnh không được vượt quá 5MB');

        await driver.findElement(By.css('[data-testid="cancel-button"]')).click();
    });

    // Trường hợp kiểm thử 7: Gửi biểu mẫu trống
    it('Hiển thị lỗi khi gửi biểu mẫu trống', async function () {
        await enterEditMode();
        const fullNameInput = await driver.findElement(By.css('[data-testid="fullname-input"]'));
        await fullNameInput.clear();
        const emailInput = await driver.findElement(By.css('[data-testid="email-input"]'));
        await emailInput.clear();
        const phoneInput = await driver.findElement(By.css('[data-testid="phone-input"]'));
        await phoneInput.clear();
        const usernameInput = await driver.findElement(By.css('[data-testid="username-input"]'));
        await usernameInput.clear();

        await driver.findElement(By.css('[data-testid="submit-button"]')).click();
        await driver.wait(until.elementLocated(By.css('[data-testid="error-message"]')), 5000);
        const errorMessage = await driver.findElement(By.css('[data-testid="error-message"]')).getText();
        expect(errorMessage).to.include('Tất cả các trường bắt buộc phải được điền');

        await driver.findElement(By.css('[data-testid="cancel-button"]')).click();
    });

    // Trường hợp kiểm thử 8: Nhấp nút Hủy
    it('Giữ thông tin profile không thay đổi sau khi nhấp nút cancel', async function () {
        await enterEditMode();

        const displayElements = await driver.findElements(By.css('[data-testid="fullname-display"]'));
        let originalFullName;
        if (displayElements.length > 0) {
            originalFullName = await displayElements[0].getText();
        } else {
            originalFullName = await driver.findElement(By.css('[data-testid="user-fullname"]')).getText();
        }

        const fullNameInput = await driver.findElement(By.css('[data-testid="fullname-input"]'));
        await fullNameInput.clear();
        await fullNameInput.sendKeys('Test Cancel');

        await driver.findElement(By.css('[data-testid="cancel-button"]')).click();
        await driver.wait(until.elementLocated(By.css('[data-testid="edit-button"]')), 5000);

        const displayedFullName = await driver.findElement(By.css('[data-testid="user-fullname"]')).getText();
        expect(displayedFullName).to.equal(originalFullName);
    });
});