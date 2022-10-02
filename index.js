const puppeteer = require('puppeteer');
const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');

async function start() {

  // abrir el navegador con puppeteer
  const browser = await puppeteer.launch();

  // nueva pagina
  const page = await browser.newPage();
  await page.goto('https://learnwebcode.github.io/practice-requests');


  /* **** TRABAJAR CON TEXTO **** */

  // guardar texto en disco, de las clases de la pagina a scrapear
  const names = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.info strong')).map(x => x.textContent);
  })
  await fs.writeFile(path.join(__dirname, './src/output/animals.txt'), names.join('\r\n'));


  /* **** TRABAJAR CON BOTONES **** */

  await page.click('#clickme');
  // obtener el texto que aparece luego de dar click
  const clickedData = await page.$eval('#data', el => el.textContent);
  console.log(clickedData);


  /* **** TRABAJAR CON FORM **** */

  // primer valor de type es el selector y el segundo es el valor que queremos colocar
  await page.type('#ourfield', 'blue');
  // crear una promesa para simular dar click y luego esperar a que cargue la siguiente pagina
  await Promise.all([page.click('#ourform button'), page.waitForNavigation()])

  // obtener el texto de la nueva pagina
  const info = await page.$eval('#message', el => el.textContent);
  console.log(info);


  /* **** TRABAJAR CON FOTOGRAFIAS **** */

  await page.goto('https://learnwebcode.github.io/practice-requests');

  // screenshot
  await page.screenshot({path: './src/output/amazing.png', fullPage: true})
  
  // guardar imagenes en un array | $$eval para seleccionar multiples elementos
  const photos = await page.$$eval('img', (imgs) => {
    return imgs.map(x => x.src)
  });

  console.log(photos);

  // recorrer el array de fotos y crear archivos jpg
  for (const photo of photos) {
  // page.goto visita la ulr completa de las imagenes
    const imagepage = await page.goto(photo);
    await fs.writeFile(path.join(__dirname, ("./src/output/" + photo.split('/').pop())), await imagepage.buffer())
  };

  // cerrar el navegador
  await browser.close();  

}


/* **** AUTOMATIZAR **** */

start()

// obtiene dos parametros, la funcion a ejecutar y el tiempo a esperar
//setInterval(start, 4999);

// realizar las operaciones en una fecha/hora especifica
// cron.schedule('*/1 * * * *', start);