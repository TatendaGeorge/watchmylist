import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer-core';
import { extractCurrency, extractDescription, extractPrice } from './utils.js';

export default async function scrapeProduct(url) {
    if(!url) return;
  
    try {
      const browser = await puppeteer.launch({
        headless: true,
        executablePath: '/opt/render/.cache/puppeteer',
      });
      const page = await browser.newPage();
      await page.goto(url);
      const html = await page.content();
      await browser.close();
  
      // Fetch the product page
      const $ = cheerio.load(html);
  
      // // Extract the product title
      const title = $('.product-title h1').text().trim();
      const currentPrice = extractPrice($('[data-ref="buybox-price-main"]'));
  
      const originalPrice = extractPrice($('.buybox-module_list-price_3rqTk [data-ref="buybox-discounted-price"]'));
      let originalPriceAlt = null;
      if (!originalPrice) {
        originalPriceAlt = currentPrice;
      }
      const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';
  
      const image = $('[data-ref="main-gallery-photo-single"]').attr('src');
      var image2 = null;
      if(!image) {
         image2 = $('.image-box img').attr('src');
      }
      const category = $('.brand-link a').text().trim();
      const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");
  
      const description = extractDescription($)
  
      // Construct data object with scraped information
      const data = {
        url,
        currency:'R',
        image: image || image2,
        title,
        currentPrice: Number(currentPrice) || Number(originalPrice),
        originalPrice: Number(originalPrice) || Number(currentPrice) || Number(originalPriceAlt),
        priceHistory: [
          {price: currentPrice, originalPrice: originalPrice || originalPriceAlt}
        ],
        discountRate: Number(discountRate),
        category: category,
        reviewsCount:100,
        reviews: [
          {
            review: "Real Techniques always the best quality! Love the different size brushes and the lash brush works so good. Great buy!"
          },
          {
            review: "Real techniques is great as usual."
          },
          {
            review: "Good brushes, but be aware that the largest is bigger than most concealer brushes."
          },
          {
            review: "Best brushes ever. These brushes changed the game."
          }
        ],
        stars: 4.5,
        isOutOfStock: outOfStock,
        description,
        lowestPrice: Number(currentPrice) || Number(originalPrice),
        highestPrice: Number(originalPrice) || Number(currentPrice),
        averagePrice: Number(currentPrice) || Number(originalPrice),
      }
  
      return data;
    } catch (error) {
      console.log(error);
    }
  }