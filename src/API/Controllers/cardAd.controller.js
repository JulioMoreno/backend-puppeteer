const puppeteer = require("puppeteer");
const config = require("config");
const createPost = async (req, res, next) => {
  const price = parseInt(req.body.price);
  const description = req.body.description.trim();
  try {
    if (
      !Number.isInteger(price) ||
      price < 1 ||
      typeof description !== "string" ||
      description.length < 1
    )
      return res
        .status(400)
        .send({ message: "Price or description are invalid" });
    const {result, imgURL} = await goPage(price, description);
    if (result) {
      return res
        .status(201)
        .json({ status: 201, message: "Ad posted", post_imge: `${config.host}:${config.port}/post${imgURL}`});
    } else return res.status(500).end();
  } catch (e) {
    return res.status(500).json({ status: 500, message: e.message });
  }
};

const goPage = async (price, desc) => {
  try {
    let postResult = {result: false, imgURL: ''};
    const dateIso = new Date()
      .toISOString()
      .replace(/T/, "-")
      .replace(/\..+/, "")
      .replace(/:/g, "");
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
    });
    const page = await browser.newPage();
    const url = "https://www.seminuevos.com";
    await page.goto(url, { timeout: 600000 });
    await page.evaluate(() => document.querySelector(".login-btn").click());
    await page.waitForNavigation();
    await page.type("#email_login", "julio.0808.creep@gmail.com");
    await page.type("#password_login", "Ju110.89");
    await page.evaluate(() => document.querySelector(".input__submit").click());
    await page.waitForNavigation();
    console.log('logeado')
    await page.evaluate(() => document.querySelector(".cta-btn > a").click());
    await page.waitForNavigation();
    await page.waitFor(3000);
    await page.evaluate(() =>
      document.querySelector('[data-activates="dropdown_brands"]').click()
    );
    await page.waitFor(2000);
    await page.evaluate(() =>
      document.querySelector('[data-content="acura"]').children[0].click()
    );

    await page.evaluate(() =>
      document.querySelector('[data-activates="dropdown_models"]').click()
    );
    await page.waitFor(2000);
    await page.evaluate(() =>
      document.querySelector('[data-content="ilx"] > a').click()
    );

    await page.evaluate(() =>
      document.querySelector('[data-activates="dropdown_subtypes"]').click()
    );
    await page.waitFor(2000);
    await page.evaluate(() =>
      document.querySelector('[data-content="sedan"] > a').click()
    );

    await page.evaluate(() =>
      document.querySelector('[data-activates="dropdown_years"]').click()
    );
    await page.waitFor(2000);
    await page.evaluate(() =>
      document.querySelector('[data-content="2018"] > a').click()
    );

    await page.evaluate(() =>
      document.querySelector('[data-activates="dropdown_provinces"]').click()
    );
    await page.waitFor(2000);
    await page.evaluate(() =>
      document.querySelector('[data-content="nuevo leon"] > a').click()
    );

    await page.evaluate(() =>
      document.querySelector('[data-activates="dropdown_cities"]').click()
    );
    await page.waitFor(2000);
    await page.evaluate(() =>
      document.querySelector('[data-content="monterrey"] > a').click()
    );

    await page.type("#input_recorrido", "20000");
    await page.type(".input_precio", price.toString());

    await page.evaluate(() => document.querySelector(".next-button").click());
    await page.waitForNavigation();
    await page.waitFor(2000);
    await page.type("#input_text_area_review", desc);
    await page.waitFor(2000);

    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      page.click(".file-input"),
    ]);
    await fileChooser.accept([
      "./resources/cars/acura_1.jpg",
      "./resources/cars/acura_2.jpg",
      "./resources/cars/acura_3.jpg",
    ]);
    await page.waitFor(3000);
    await page.evaluate(() =>
      document.querySelectorAll(".next-button")[1].click()
    );
    await page.waitForNavigation();
    await page.waitFor(3000);
    await page.evaluate(() => document.querySelector(".active-plan").click());
    await page.waitFor(3000);

    await page.screenshot({
      path: `./resources/${dateIso}.png`,
      fullPage: true,
    });

    await page.close();
    await browser.close();

    postResult.result = true;
    postResult.imgURL = `/resources/${dateIso}.png`;

    return postResult;
  } catch (e) {
    return postResult;
  }
};

const welcome = async (req, res, next) => {
  try {
    return res
      .status(200)
      .json({ status: 200, message: "Welcome to InteliMotor" });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

module.exports = {
  createPost,
  welcome,
};
