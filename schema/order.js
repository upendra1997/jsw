const {Schema} = require('mongoose');
const validator = require('validator');

const orderSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        minlength: 1,
        maxlength: 512,
    },
    materialType: {
        type: String,
        required: true,
    },
    pincode:{
        type: Number,
        required: true,
        minlength: 6,
        maxlength: 6,
    },
    name: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
        validate: {
            validator: v => validator.isMobilePhone(v, 'en-IN'),
            message: "Not a valid mobile number"
        },
    },
    GST:{
        type: String,
    },
    status: {
        type: String,
        default: 'NotVerified',
        enum: ['NotVerified', 'Packaging', 'On Route', 'Delivered'], //TODO: add more statuses
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    driver: {
        name: {
            type: String,
        },
        contact: {
            type: String,
            validate: {
                validator: v => validator.isMobilePhone(v, 'en-IN'),
                message: "Not a valid mobile number"
            },
        }
    }
});


module.exports = {orderSchema};