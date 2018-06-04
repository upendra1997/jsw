const {Schema} = require('mongoose');
const validator = require('validator');

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
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
    status: {
        type: String,
        default: 'NotVerified',
        enum: ['NotVerified', 'Packaging',], //TODO: add more statuses
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
                validator: v => validator.isMobilePhone(v, 'any'),
                message: "Not a valid mobile number"
            },
        }
    }
});


module.exports = {orderSchema};