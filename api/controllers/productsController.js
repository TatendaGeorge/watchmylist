import Product from "../models/productModel.js";
import scrapeProduct from "../lib/scraper.js";
import {
  getAveragePrice,
  getHighestPrice,
  getLowestPrice,
} from "../lib/utils.js";
import pQueue from "p-queue";

// Create a promise-based queue with concurrency control
const queue = new pQueue({ concurrency: 2 });

const getAllProducts = async (req, res) => {
  try {
    const { limit, skip } = req.query;

    const pageSize = parseInt(limit);
    const totalProducts = await Product.countDocuments();

    const randomSample = await Product.aggregate([
      { $sample: { size: totalProducts } },
    ]);

    const products = randomSample
      .sort((a, b) => b.createdAt - a.createdAt) // Sort by createdAt in descending order
      .slice(parseInt(skip), parseInt(skip) + pageSize);

    return res.json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getRecentProducts = async (req, res) => {
  try {
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(4);

    return res.json(recentProducts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getProduct = async (req, res) => {
  if (!req.body.id) return;

  try {
    const product = await Product.findOne({ _id: req.body.id });
    if (!product) return null;

    return res.json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const addUserEmailToProduct = async (req, res) => {
  if (!req.body.id && !req.body.email) return;

  const productId = req.body.productId;
  const userEmail = req.body.email;
  const userId = req.body.userId;
  const onSale = req.body.onSale;
  const inStock = req.body.inStock;
  const priceDrop = req.body.priceDrop;
  const desiredPrice = req.body.desiredPrice;
  const desiredPriceValue = req.body.desiredPriceValue;

  try {
    const product = await Product.findById(productId);

    if (!product) return;

    const userIndex = product.users.findIndex(
      (user) => user.email === userEmail
    );

    if (userIndex !== -1) {
      // User exists, update their tracking information
      const existingUser = product.users[userIndex];
      existingUser.userId = userId;
      existingUser.onSale = onSale;
      existingUser.inStock = inStock;
      existingUser.priceDrop = priceDrop;
      existingUser.desiredPrice = desiredPrice;
      existingUser.desiredPriceValue = desiredPriceValue;
    } else {
      // User doesn't exist, add a new user
      product.users.push({
        email: userEmail,
        userId: userId,
        onSale: onSale,
        inStock: inStock,
        priceDrop: priceDrop,
        desiredPrice: desiredPrice,
        desiredPriceValue: desiredPriceValue,
      });
    }

    await product.save();

    // const emailContent = await generateEmailBody(product, "WELCOME");

    // await sendEmail(emailContent, [userEmail]);

    return res.json({ message: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getUserTrackedProducts = async (req, res) => {
  if (!req.body.userId) return;

  const userId = req.body.userId;

  try {
    const products = await Product.find({ "users.userId": userId });

    if (!products) return;

    return res.json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const scrapeAndStoreProduct = async (req, res) => {
  if (!req.body.url) return;

  try {
    const scrapedProduct = await scrapeProduct(req.body.url);

    if (!scrapedProduct) return;

    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    if (existingProduct) {
      const updatedPriceHistory = [
        ...existingProduct.priceHistory,
        {
          price: scrapedProduct.currentPrice,
          originalPrice: scrapedProduct.originalPrice,
        },
      ];

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );
    return res.json(newProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

function getRandomDelay(minDelay, maxDelay) {
  const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
  return Math.floor(randomDelay);
}

const scrapeAndStoreProduct2 = async (product) => {
  if (!product) return;

  try {
    if (product && product.url) {
      const randomDelay = getRandomDelay(2000, 5000);
      await new Promise((resolve) => setTimeout(resolve, randomDelay));

      const scrapedProduct = await scrapeProduct(product.url);

      if (!scrapedProduct) return;

      let product = scrapedProduct;

      const existingProduct = await Product.findOne({
        url: scrapedProduct.url,
      });

      if (existingProduct) {
        const updatedPriceHistory = [
          ...existingProduct.priceHistory,
          {
            price: scrapedProduct.currentPrice,
            originalPrice: scrapedProduct.originalPrice,
          },
        ];

        product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };
      }

      const newProduct = await Product.findOneAndUpdate(
        { url: scrapedProduct.url },
        product,
        { upsert: true, new: true }
      );
    } else {
      console.log(`Product URL is missing for one of the products.`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateProductDetails = async (req, res) => {
  // Define a function to scrape and store a single product
  const scrapeAndStoreProduct2 = async (product) => {
    try {
      if (product && product.url) {
        const randomDelay = getRandomDelay(2000, 5000);
        await new Promise((resolve) => setTimeout(resolve, randomDelay));

        const scrapedProduct = await scrapeProduct(product.url);

        if (!scrapedProduct) return;

        let productData = scrapedProduct;

        const existingProduct = await Product.findOne({
          url: scrapedProduct.url,
        });

        if (existingProduct) {
          const updatedPriceHistory = [
            ...existingProduct.priceHistory,
            {
              price: scrapedProduct.currentPrice,
              originalPrice: scrapedProduct.originalPrice,
            },
          ];

          productData = {
            ...scrapedProduct,
            priceHistory: updatedPriceHistory,
            lowestPrice: getLowestPrice(updatedPriceHistory),
            highestPrice: getHighestPrice(updatedPriceHistory),
            averagePrice: getAveragePrice(updatedPriceHistory),
          };
        }

        const newProduct = await Product.findOneAndUpdate(
          { url: scrapedProduct.url },
          productData,
          { upsert: true, new: true }
        );
      } else {
        console.log(`Product URL is missing for one of the products.`);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  try {
    // Query the database to retrieve product URLs
    const products = await Product.find({}, "url");

    // const products = await Product.aggregate([
    //   {
    //     $match: {
    //       $or: [
    //         { 'users.onSale': true },
    //         { 'users.inStock': true },
    //         { 'users.priceDrop': true },
    //         { 'users.desiredPrice': true },
    //       ],
    //     },
    //   },
    //   { $project: { url: 1 } }, // You can include more fields if needed
    // ]);

    if (products.length === 0) {
      console.log("No products found for updating.");
      return;
    }

    // Add product scraping tasks to the queue
    products.forEach((product) => {
      queue.add(() => scrapeAndStoreProduct2(product));
    });

    // Wait for all tasks in the queue to complete
    await queue.onIdle();

    console.log("All product details updated.");
  } catch (error) {
    console.error("Error querying the database:", error);
  }
};

export {
  updateProductDetails,
  getAllProducts,
  scrapeAndStoreProduct,
  getProduct,
  getRecentProducts,
  addUserEmailToProduct,
  getUserTrackedProducts,
};
