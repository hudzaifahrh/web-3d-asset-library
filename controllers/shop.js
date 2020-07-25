const Product = require('../models/product');
const ITEMS_PER_PAGE = 10;
const Pameran = require('../models/pameran');

//3D Library
exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;

    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then(products => {
            console.log(products);
            res.render('shop/product-list', { 
                prods: products, 
                pageTitle: '3D Library',
                path: '/products',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', { 
                product: product, 
                pageTitle: 'View', 
                path:'/products'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getIndex = (req, res, next) => {
    res.render('shop/index', {  
        pageTitle: 'Home', 
        path: '/'
    });
};

exports.getDownload = (req, res, next) => {
    res.download(req.params.filepath, err => {
        if (err) {
            console.log(err);
            console.log('Coba lagi');
        } else {
            console.log('Berhasil');
        }
    });
};

//Pameran
exports.getPamerans = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;

    Pameran.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Pameran.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then(pamerans => {
            console.log(pamerans);
            res.render('shop/pameran-list', { 
                pamers: pamerans, 
                pageTitle: 'All Property',
                path: '/pamerans',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getPameran = (req, res, next) => {
    const pamerId = req.params.pameranId;
    Pameran.findById(pamerId)
        .then(pameran => {
            res.render('shop/pameran-detail', { 
                pameran: pameran, 
                pageTitle: 'View', 
                path:'/pamerans'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};