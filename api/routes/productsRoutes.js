import express from 'express';
import { 
    getAllProducts,
    getRecentProducts,
    getProduct,
    addUserEmailToProduct,
    scrapeAndStoreProduct,
    getUserTrackedProducts,
    updateProductDetails,
} from '../controllers/productsController.js';

const router = express.Router();

router.route('/products/getAllProducts').get(getAllProducts);
router.route('/products/getRecentProducts').get(getRecentProducts);
router.route('/products/getProduct').post(getProduct);
router.route('/products/getUserTrackedProducts').post(getUserTrackedProducts);
router.route('/products/addUserEmailToProduct').post(addUserEmailToProduct);
router.route('/products/scrapeAndStoreProduct').post(scrapeAndStoreProduct);

router.route('/products/updateProductDetails').get(updateProductDetails);

export default router;
