const mongoose = require('mongoose');
const {feedbackSchema} = require('./feedback');
const {historySchema} = require('./history');
const {orderSchema} = require('./order');
const {userSchema} = require('./user');

mongoose.connect('mongodb://localhost/Test');

const User = mongoose.model('users', userSchema);
const Feedback = mongoose.model('feedbacks', feedbackSchema);
const History = mongoose.model('histories', historySchema);
const Order = mongoose.model('orders', orderSchema);

module.exports = {mongoose, Feedback, History, Order, User};