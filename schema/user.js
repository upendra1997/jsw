const {Schema} = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {env} = require('../config');

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
        validate: {
            validator: v => validator.isEmail(v),
            message: "Not a valid Email"
        },
    },
    contact: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: v => validator.isMobilePhone(v, 'en-IN'),
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
        minlength: 8,
        trim: true,
    },
    address: {
        type: String,
        minlength: 1,
        maxlength: 512,
        trim: true,
        required: true,
    },
    history: [{
        type: Schema.Types.Mixed,
    }],
    members: {
        type: [String],
    },
    owner: {
        type: String,
    },
    kind: {
        type: String,
        required: true,
        default: "admin",
        enum: ["admin", "dealer", "sub-dealer"],
    },
    tokens: [{
        access: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
        }
    }],
});

userSchema.methods.generateToken = function (access = 'auth') {
    const user = this;
    const token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, env["secret"]).toString();
    user.tokens.push({access, token});
    return user.save()
        .then(() => token);
};

userSchema.methods.removeToken = function (token) {
    const user = this;
    return user.update({
        $pull: {
            tokens: {token}
        }
    });
};

userSchema.statics.findByToken = function (token, access = "auth") {
    const user = this;
    let decoded = null;
    try {
        decoded = jwt.verify(token, env["secret"])
    } catch (e) {
        return Promise.reject();
    }
    return user.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': access,
    });
};

userSchema.statics.findByCredentials = function (email, password, access = "auth") {
    const User = this;
    return User.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        if (access !== "auth") {
            return Promise.resolve(user);
        }
        return new Promise((resolve, reject) => {
            // Use bcrypt.compare to compare password and user.password
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};

userSchema.pre('save', function (next) {
    const user = this;
    // This middleware will run every time save() is called, we don't want to hash our password again and again. that's why isModified.
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    }
    else {
        next();
    }
});

module.exports = {userSchema};