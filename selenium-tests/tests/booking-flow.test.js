const { Builder, By, until } = require("selenium-webdriver");
const { expect } = require("chai");

// Đổi lại đường dẫn nếu cần
const BASE_URL = "http://localhost:5173";

// Helper: delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

describe("Luồng đặt vé VietCine", function () {
  this.timeout(60000); // Tăng timeout cho các thao tác UI
  let driver;

  beforeEach(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  afterEach(async () => {
    if (driver) await driver.quit();
  });

  async function login() {
    await driver.get(BASE_URL + "/login");
    await driver.wait(until.elementLocated(By.name("email")), 10000);
    await driver.findElement(By.name("email")).sendKeys("phuphupu5@gmail.com");
    await driver.findElement(By.name("password")).sendKeys("27102003");
    await driver.findElement(By.css('button[type="submit"]')).click();
    // Chờ chuyển trang hoặc có dấu hiệu đăng nhập thành công
    await driver.wait(until.urlIs(BASE_URL + "/"), 10000);
  }

  it("Luồng đặt vé: Đăng nhập, chọn rạp, brand=1, rạp=7, ngày 2025-06-21, suất đầu, ghế B2, mua vé", async () => {
    await login();
    // Nhấp vào menu "Rạp chiếu"
    await driver.wait(
      until.elementLocated(By.xpath("//a[contains(@href, '/book-tickets')]")),
      10000
    );
    await driver
      .findElement(By.xpath("//a[contains(@href, '/book-tickets')]"))
      .click();
    await delay(1000);

    // Chờ trang rạp chiếu
    await driver.wait(until.urlContains("/book-tickets"), 10000);
    await delay(1000);

    // Chọn theaterbrand id=1
    await driver.wait(
      until.elementLocated(By.css('[data-testid="brand-btn-1"]')),
      10000
    );
    await driver.findElement(By.css('[data-testid="brand-btn-1"]')).click();
    await delay(1000);

    // Chọn rạp id=7
    await driver.wait(
      until.elementLocated(By.css('[data-testid="cinema-btn-7"]')),
      10000
    );
    await driver.findElement(By.css('[data-testid="cinema-btn-7"]')).click();
    await delay(1000);

    // Chọn ngày 2025-06-21
    await driver.wait(
      until.elementLocated(By.css('[data-testid^="date-btn-"]')),
      10000
    );
    const dateBtn = await driver.findElement(
      By.css('[data-testid="date-btn-2025-06-21"]')
    );
    await dateBtn.click();
    await delay(1000);

    // Chọn suất chiếu đầu tiên
    await driver.wait(
      until.elementLocated(By.css('[data-testid^="showtime-btn-"]')),
      10000
    );
    const showtimeBtn = await driver.findElement(
      By.css('[data-testid^="showtime-btn-"]')
    );
    await showtimeBtn.click();
    await delay(1000);

    // Chờ trang chọn ghế
    await driver.wait(until.urlContains("seat-selection"), 10000);
    // Chọn ghế B2
    await driver.wait(
      until.elementLocated(By.css('[data-testid="seat-btn-B7"]')),
      10000
    );
    await driver.findElement(By.css('[data-testid="seat-btn-B7"]')).click();
    await delay(1000);

    // Nhấn nút mua vé/tiếp tục
    await driver.wait(
      until.elementLocated(By.css('[data-testid="proceed-to-payment-btn"]')),
      10000
    );
    await driver
      .findElement(By.css('[data-testid="proceed-to-payment-btn"]'))
      .click();
    await delay(1000);

    // Chờ modal chọn đồ ăn xuất hiện và thao tác chọn món
    await driver.wait(
      until.elementLocated(By.css('[data-testid="food-plus-btn-1"]')),
      10000
    );
    await driver.findElement(By.css('[data-testid="food-plus-btn-1"]')).click();
    await delay(1000);
    await driver.findElement(By.css('[data-testid="food-plus-btn-2"]')).click();
    await delay(1000);
    await driver
      .findElement(By.css('[data-testid="food-confirm-btn"]'))
      .click();
    await delay(1000);

    // Chờ bạn thao tác thanh toán thủ công trên trang VNPAY và redirect về payment-return
    // Khi đã về trang payment-return, thực hiện các bước sau:
    await driver.wait(until.urlContains("payment-return"), 120000); // Chờ tối đa 2 phút cho user thao tác
    await delay(5000); // Hiển thị trang kết quả 5s
    // Bấm nút về trang chủ
    await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Về trang chủ')]")),
      10000
    );
    await driver
      .findElement(By.xpath("//button[contains(., 'Về trang chủ')]"))
      .click();
    await delay(2000); // Chờ 2s rồi kết thúc
  });
});


