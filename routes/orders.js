const express = require('express');
const {Order, User} = require('../schema/models');
const {_} = require('lodash');
const {logHistory} = require('../middleware/loghistory');
const {authenticate} = require('../middleware/authenticate');
const router = express.Router();


router.get('/history', authenticate, function (req, res) {
    const user = req.user;
    if (user.history)
        res.send(user.history);
    else
        res.send({});
});

router.get('/request/verify', authenticate, function (req, res) {
    const members = req.user.members || [];
    Order.find({
        userId: {
            $in: members,
        },
        status: 'NotVerified'
    }).then(doc => {
        res.send(doc);
    }).catch((e) => {
        res.send({error: e});
    })
});


router.get('/', authenticate, function (req, res) {
    const id = req.user._id;
    Order.find({
        userId: id,
        status: "NotVerified",
    }).sort({
        '_id': -1
    }).then((data) => {
        console.log(data);
        res.send(data);
    }).catch((e) => {
        res.status(505).send(e);
    });
});

router.post('/', authenticate, function (req, res, next) {
    const id = req.user._id;
    let data = _.pick(req.body, ['address', 'materialType', 'quantity']);
    User.findById(id).then((user) => {
        if (!data.address)
            data.address = user.address;
        console.log(data.address);
    }).then(() => {
        data.userId = id;
        const order = new Order(data);
        order.save().then((doc) => {
            console.log("Order Saved");
            data.message = "Object Created";
            req.HISTORY = data;
            res.send({message: "Order Created"});
            next();
        }).catch((e) => {
            res.status(500).send({"error": e});
            console.log("Order not saved " + e);
        });
    }).catch((e) => {
        res.status(500).send({"error": e});
        console.log("user Not found " + e);
    });
}, logHistory);

router.put('/:id', authenticate, function (req, res, next) {
    const userId = req.user._id;
    const orderId = req.params["id"];
    const data = _.pick(req.body, ['location', 'status', 'driver']);
    console.log(data);
    let members = User.findById(userId).members || [];
    Order.find({
        userId: {
            $in: members,
        },
        _id: orderId,
    }).update({
        data
    }).then((doc) => {
        res.send(doc);
        data.message = "Order Updated";
        req.HISTORY = data;
        next();
    }).catch((e) => {
        res.status(500).send(e);
    });
}, logHistory);

router.delete('/:id', authenticate, function (req, res, next) {
    const userId = req.user._id;
    const orderId = req.params["id"];
    let data = {};
    let members = User.findById(userId).members || [];
    Order.find({
        userId: {
            $in: [userId, ...members]
        },
        _id: orderId,
    }).remove((doc) => {
        res.send(doc);
        data.message = "Order Deleted";
        req.HISTORY = data;
        next();
    }).catch((e) => {
        res.status(505).send(e);
    });
}, logHistory);

module.exports = router;
