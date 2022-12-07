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
    "https://www.amazon.com/s?k=amazonbasics&language=es&pd_rd_r=9b8012b9-fec2-4ec4-bc6f-15abde2de6de&pd_rd_w=H2Any&pd_rd_wg=CpwOi&pf_rd_p=6353e4d5-5224-4bbe-a21f-e4709c728ef1&pf_rd_r=AE1YK2TEJ6BDMGBFT7QG&ref=pd_gw_unk"
  );

  // selector of all products
  const productsHandles = await page.$$(
    ".s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item"
  );

  let i = 0;
  let items = [];

  // loop thru all handle
  for (const productHandle of productsHandles) {
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
  }

  console.log(items);

  // await browser.close();
})();
