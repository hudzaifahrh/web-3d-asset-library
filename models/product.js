const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    originalname: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    pathImage: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);