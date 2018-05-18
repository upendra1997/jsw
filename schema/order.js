const {Schema} = require('mongoose');

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
        default: 'TODO',
        minlength: 1,
        maxlength: 512,
        required: true,
    },
    materialType: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'NotVerified',
        enum: ['NotVerified', 'Packaging',],
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
});


module.exports = {orderSchema};