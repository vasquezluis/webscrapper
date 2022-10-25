const puppeteer = require("puppeteer");
const cron = require("node-cron");
const fs = require("fs").promises;
const path = require("path");

(async () => {
  // abrir el navegador con puppeteer
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./temp",
  });

  // nueva pagina
  const page = await browser.newPage();
  // ir a la pagina de destino
  await page.goto(
    "https://www.amazon.com/s?k=gaming+headsets&pd_rd_r=b2b53065-f5d6-42c5-bb6c-ae878728d13d&pd_rd_w=3NvzD&pd_rd_wg=aD4tb&pf_rd_p=12129333-2117-4490-9c17-6d31baf0582a&pf_rd_r=AXT2EWAN5CSB5Z9QSXBY&ref=pd_gw_unk"
  );

  // obtener className del parent (contenedor de los productos)
  const productsHandles = await page.$$(
    ".s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item"
  );

  // array item para contener todos los resultados
  let items = [];

  // loop de todos los elementos
  for (const productHandle of productsHandles) {
    let title = "Null";
    let price = "Null";
    let img = "Null";

    // atributos para cada producto (titulo, precio e imagen)
    try {
      title = await page.evaluate(
        (element) => element.querySelector("h2 > a > span").textContent,
        productHandle
      );
    } catch (error) {}
    try {
      price = await page.evaluate(
        (element) =>
          element.querySelector(".a-price > .a-offscreen").textContent,
        productHandle
      );
    } catch (error) {}
    try {
      img = await page.evaluate(
        (element) => element.querySelector(".s-image").getAttribute("src"),
        productHandle
      );
    } catch (error) {}

    // comprobar contenido de cada item
    if (title !== "Null") {
      // crear el array con los items
      items.push({title, price, img});
    }
  }

  console.log(items);
})();

async function start() {
  // /* **** TRABAJAR CON TEXTO **** */
  // // guardar texto en disco, de las clases de la pagina a scrapear
  //   return Array.from(document.querySelectorAll('.info strong')).map(x => x.textContent);
  // const names = await page.evaluate(() => {
  //   return Array.from(document.querySelectorAll('.info strong')).map(x => x.textContent);
  // })
  // await fs.writeFile(path.join(__dirname, './src/output/animals.txt'), names.join('\r\n'));
  // /* **** TRABAJAR CON BOTONES **** */
  // await page.click('#clickme');
  // // obtener el texto que aparece luego de dar click
  // const clickedData = await page.$eval('#data', el => el.textContent);
  // console.log(clickedData);
  // /* **** TRABAJAR CON FORM **** */
  // // primer valor de type es el selector y el segundo es el valor que queremos colocar
  // await page.type('#ourfield', 'blue');
  // // crear una promesa para simular dar click y luego esperar a que cargue la siguiente pagina
  // await Promise.all([page.click('#ourform button'), page.waitForNavigation()])
  // // obtener el texto de la nueva pagina
  // const info = await page.$eval('#message', el => el.textContent);
  // console.log(info);
  // /* **** TRABAJAR CON FOTOGRAFIAS **** */
  // await page.goto('https://learnwebcode.github.io/practice-requests');
  // // screenshot
  // await page.screenshot({path: './src/output/amazing.png', fullPage: true})
  // // guardar imagenes en un array | $$eval para seleccionar multiples elementos
  // const photos = await page.$$eval('img', (imgs) => {
  //   return imgs.map(x => x.src)
  // });
  // console.log(photos);
  // // recorrer el array de fotos y crear archivos jpg
  // for (const photo of photos) {
  // // page.goto visita la ulr completa de las imagenes
  //   const imagepage = await page.goto(photo);
  //   await fs.writeFile(path.join(__dirname, ("./src/output/" + photo.split('/').pop())), await imagepage.buffer())
  // };
  // cerrar el navegador
  // await browser.close();
}

/* **** AUTOMATIZAR **** */
start();
