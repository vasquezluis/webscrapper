import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    // full window
    defaultViewport: false,
    // save user actions
    userDataDir: "./tmp",
  });

  const page = await browser.newPage();

  await page.goto(
    "https://www.amazon.com/s?k=amazonbasics&crid=8Z1981FS61AU&qid=1671139161&sprefix=%2Caps%2C108&ref=sr_pg_1",
    { waitUntil: "load" }
  );

  // selector of all products
  const productsHandles = await page.$$(
    ".s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item"
  );

  let i = 0;
  let items = [];

  // loop thru all handle
  for (const productHandle of productsHandles) {
    // handle disabled button on page
    let isBtnDisabled = false;

    while (!isBtnDisabled) {
      let title = "Null";
      let price = "Null";
      let image = "Null";

      try {
        // getting product title from span
        title = await page.evaluate(
          (el) => el.querySelector("h2 > a > span").textContent,
          productHandle
        );
      } catch (error) {}
      try {
        // getting price from span
        price = await page.evaluate(
          (el) => el.querySelector(".a-price > .a-offscreen ").textContent,
          productHandle
        );
      } catch (error) {}
      try {
        // getting image from span
        image = await page.evaluate(
          (el) => el.querySelector(".s-image").getAttribute("src"),
          productHandle
        );
      } catch (error) {}

      if (title !== "Null") {
        // creating an array with all information
        items.push({ title, price, image });
      }

      // await until de selection appear then go below
      await page.waitForSelector(
        ".s-pagination-strip .s-pagination-button",
        {
          visible: true,
        }
      );

      const isDisabled =
        (await page.$(
          "span.s-pagination-item.s-pagination-next.s-pagination-disabled"
        )) !== null;

      isBtnDisabled = isDisabled;

      console.log(isDisabled);

      if (!isDisabled) {
        await page.click(
          ".s-pagination-strip .s-pagination-button"
        );
      }
    }
  }

  console.log(items);

  // await browser.close();
})();
