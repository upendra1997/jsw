const {Schema} = require('mongoose');
const validator = require('validator');


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 70,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
    },
    contact: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: v => validator.isMobilePhone(v, 'any'),
            message: "Not a valid mobile number"
        },
    },
    status: {
        type: String,
        default: 'NotVerified',
        enum: ['NotVerified', 'Verified'],
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        minlength: 1,
        maxlength: 512,
        trim: true,
        required: true,
    },
    members: {
        type: [Schema.Types.ObjectId],
    },
    owner: {
        type: Schema.Types.ObjectId,
    }
});


module.exports = {userSchema};