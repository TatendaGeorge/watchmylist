import * as cheerio from "cheerio";
import puppeteer from "puppeteer-core";
import { extractCurrency, extractDescription, extractPrice } from "./utils.js";
import * as dotenv from "dotenv";

dotenv.config();

export default async function scrapeProduct(url) {
  if (!url) return;

  console.log(process.env.AUTH);
  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://${process.env.AUTH}@brd.superproxy.io:9222`,
  });

  try {
    const page = await browser.newPage();
    // Set user agent
    // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/110.0')

    await page.goto(url);
    const html = await page.content();
    console.log(html);

    // Fetch the product page
    const $ = cheerio.load(html);
    console.log($);
    // // Extract the product title
    const title = $(".product-title h1").text().trim();
    const currentPrice = extractPrice($('[data-ref="buybox-price-main"]'));

    const originalPrice = extractPrice(
      $('.buybox-module_list-price_3rqTk [data-ref="buybox-discounted-price"]')
    );
    let originalPriceAlt = null;
    if (!originalPrice) {
      originalPriceAlt = currentPrice;
    }
    const outOfStock =
      $("#availability span").text().trim().toLowerCase() ===
      "currently unavailable";

    const image = $('[data-ref="main-gallery-photo-single"]').attr("src");
    var image2 = null;
    if (!image) {
      image2 = $(".image-box img").attr("src");
    }
    const category = $(".brand-link a").text().trim();
    const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");

    const description = extractDescription($);

    // Construct data object with scraped information
    const data = {
      url,
      currency: "R",
      image: image || image2,
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice:
        Number(originalPrice) ||
        Number(currentPrice) ||
        Number(originalPriceAlt),
      priceHistory: [
        {
          price: currentPrice,
          originalPrice: originalPrice || originalPriceAlt,
        },
      ],
      discountRate: Number(discountRate),
      category: category,
      reviewsCount: 100,
      reviews: [
        {
          review:
            "Real Techniques always the best quality! Love the different size brushes and the lash brush works so good. Great buy!",
        },
        {
          review: "Real techniques is great as usual.",
        },
        {
          review:
            "Good brushes, but be aware that the largest is bigger than most concealer brushes.",
        },
        {
          review: "Best brushes ever. These brushes changed the game.",
        },
      ],
      stars: 4.5,
      isOutOfStock: outOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    };

    return data;
  } catch (error) {
    console.error("Error in Puppeteer script:", error);
    console.log(error);
  } finally {
    await browser.close();
  }
}
