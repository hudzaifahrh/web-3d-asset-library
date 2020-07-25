const path = require('path');
const express = require('express');
const { body } = require('express-validator');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');


const router = express.Router();

//3D Library
router.get('/add-product', isAuth, adminController.getAddProduct);
router.get('/products', isAuth, adminController.getProducts);
router.post('/add-product', [
    body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
], isAuth, adminController.postAddProduct);

// router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
// router.post('/edit-product', [
//     body('title')
//         .isString()
//         .isLength({ min: 3 })
//         .trim()
// ], isAuth, adminController.postEditProduct);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);
router.post('/convert-product', isAuth, adminController.postConvertProduct);

//Pameran
router.get('/add-pameran', isAuth, adminController.getAddPameran);
router.get('/pamerans', isAuth, adminController.getPamerans);
router.post('/add-pameran', [
    body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
], isAuth, adminController.postAddPameran);
router.post('/delete-pameran', isAuth, adminController.postDeletePameran);

module.exports = router;