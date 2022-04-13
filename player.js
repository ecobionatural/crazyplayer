const puppeteer = require('puppeteer');


;(async ()=>{
const browser = await puppeteer.launch({headless: false, args: ['--disable-infobars --app']});
let [page] = await browser.pages();
await page.goto('http://localhost:3333/qq/');
page.close();
})()
