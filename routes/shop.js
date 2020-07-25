const path = require('path');
const express = require('express');
const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

//3D Library
router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);
router.get('/download/:filepath(*)', shopController.getDownload);

//Pameran
router.get('/pamerans', shopController.getPamerans);
router.get('/pamerans/:pameranId', shopController.getPameran);

module.exports = router;