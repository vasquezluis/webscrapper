import puppeteer from "puppeteer";

(async () => {
  // launch browser from puppeteer
  const browser = await puppeteer.launch({
    // headless false = show the browser
    headless: false,
  });

  // creating page from puppeteer
  const page = await browser.newPage();

  // go to selected page to scrap
  await page.goto("https://example.com");

  // creating an screenshot
  // await page.screenshot({ path: "./example.png" });

  // clonsing connection to the selected page
  //await browser.close();
})();
