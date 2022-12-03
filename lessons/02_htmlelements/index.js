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
    ".s-main-slot.s-result-list.s-search-results.sg-row"
  );

  // loop thru all handle
  for (const productHandle of productsHandles) {
    
    // getting product title from span
    const title = await page.evaluate(
      (el) => el.querySelector("h2 > a > span").textContent,
      productHandle
    );

    // do something
    console.log(title);
  }

  // await browser.close();
})();
