const mongoose = require('mongoose');
const {feedbackSchema} = require('./feedback');
const {orderSchema} = require('./order');
const {userSchema} = require('./user');
const {env} = require('../config');

mongoose.connect(env["MONGODB_URI"]);

const User = mongoose.model('users', userSchema);
const Feedback = mongoose.model('feedbacks', feedbackSchema);
const Order = mongoose.model('orders', orderSchema);

module.exports = {mongoose, Feedback, Order, User};