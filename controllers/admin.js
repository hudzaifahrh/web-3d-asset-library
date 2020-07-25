const mongoose = require('mongoose');
const fileHelper = require('../util/file');
const { validationResult } = require('express-validator');
const obj2gltf = require('obj2gltf');
const fs = require('fs');
const Product = require('../models/product');
const Pameran = require('../models/pameran');


//3D Library
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Object', 
        path: '/admin/add-product', 
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const upload = req.files['upload'][0];
    const image = req.files['image'][0];

    if (!upload) {
        if (!image) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Object', 
            path: '/admin/add-product', 
            editing: false,
            hasError: true, 
            product: {
                title: title
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }}
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Object', 
            path: '/admin/add-product', 
            editing: false,
            hasError: true, 
            product: {
                title: title
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    const originalname = upload.originalname;
    const tipe = String(upload.originalname);
    const fileType = tipe.split(".");
    const path = upload.path;
    const fileSize = upload.size;
    const pathImage = image.path;

    const product = new Product({
        title: title,
        originalname: originalname,
        fileType: fileType[1],
        path: path,
        fileSize: fileSize,
        pathImage: pathImage,
        userId: req.user
    });
    
    product
        .save()
        .then(result => {
            req.socket.setTimeout(10 * 60 * 1000);
            console.log('Created Product');
            res.status(200).redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id }) 
    .then(products =>{
        res.render('admin/products', { 
            prods: products, 
            pageTitle: 'Admin Object', 
            path: '/admin/products'
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return next(new Error('Product not found.'));
            }
            fileHelper.deleteFile(product.path);
            fileHelper.deleteFile(product.pathImage);
            return Product.deleteOne({ _id: prodId, userId: req.user._id });
        })
        .then(() => {
            console.log('DESTROYED PRODUCT');
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postConvertProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            obj2gltf(product.path)
            .then(function(gltf) {
                const data = Buffer.from(JSON.stringify(gltf));
                fs.writeFileSync('uploads/'+ product.title +'.gltf', data);
                
                const title = product.title;
                const originalname = product.title +'.gltf';
                const fileType = 'gltf';
                const path = 'uploads/'+ product.title +'.gltf';
                const fileSize = product.fileSize;
                const pathImage = product.pathImage;

                const newProduct = new Product({
                    title: title,
                    originalname: originalname,
                    fileType: fileType,
                    path: path,
                    fileSize: fileSize,
                    pathImage: pathImage,
                    userId: req.user
            });
            newProduct.save()
            });
        })
        .then(() => {
            console.log('CONVERTED OBJECT');
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

//Pameran
exports.getAddPameran = (req, res, next) => {
    res.render('admin/edit-pameran', {
        pageTitle: 'Add Property Exhibition', 
        path: '/admin/add-pameran', 
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    });
};

exports.postAddPameran = (req, res, next) => {
    const title = req.body.title;
    const upload = req.files['upload'][0];
    const image = req.files['image'][0];

    if (!upload) {
        if (!image) {
        return res.status(422).render('admin/edit-pameran', {
            pageTitle: 'Add Property Exhibition', 
            path: '/admin/add-pameran', 
            editing: false,
            hasError: true, 
            product: {
                title: title
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }}
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('admin/edit-pameran', {
            pageTitle: 'Add Property Exhibition', 
            path: '/admin/add-pameran', 
            editing: false,
            hasError: true, 
            product: {
                title: title
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    const originalname = upload.originalname;
    const tipe = String(upload.originalname);
    const fileType = tipe.split(".");
    const path = upload.path;
    const fileSize = upload.size;
    const pathPoster = image.path;

    const pameran = new Pameran({
        title: title,
        originalname: originalname,
        fileType: fileType[1],
        path: path,
        fileSize: fileSize,
        pathPoster: pathPoster,
        userId: req.user
    });
    
    pameran
        .save()
        .then(result => {
            console.log('Created Property');
            res.status(200).redirect('/admin/pamerans');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getPamerans = (req, res, next) => {
    Pameran.find({ userId: req.user._id }) 
    .then(pamerans =>{
        res.render('admin/pamerans', { 
            pamers: pamerans, 
            pageTitle: 'Admin Exhibition', 
            path: '/admin/pamerans'
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postDeletePameran = (req, res, next) => {
    const pamerId = req.body.pameranId;
    Pameran.findById(pamerId)
        .then(pameran => {
            if (!pameran) {
                return next(new Error('Property not found.'));
            }
            fileHelper.deleteFile(pameran.path);
            fileHelper.deleteFile(pameran.pathPoster);
            return Pameran.deleteOne({ _id: pamerId, userId: req.user._id });
        })
        .then(() => {
            console.log('DESTROYED PROPERTY');
            res.redirect('/admin/pamerans');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};