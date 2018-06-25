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
        enum: ['CLINKER','GGBS','GBS_SAND','GBS_SLAG','OPC-43','OPC-53','PSC','PSC-CHD','PPC'],
        required: true,
        default: 'PSC'
    },
    packingType:{
        type: 'String',
        enum: ['Loose','HPDE','2Side Lamination','1Side Lamination','Paper','Ultra Filteration','BP'],
        required: true,
        default: 'HDPE'
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
        trim: true,
        minlength: 1,
        maxlength: 70,
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
        trim: true,
    },
    status: {
        type: String,
        default: 'NotVerified',
        enum: ['NotVerified', 'Under Process','Delivery Instruction Issued','Under Loading', 'In transit', 'Delivered'],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        trim: true,
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