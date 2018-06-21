const express = require('express');
const {Order, User, mongoose} = require('../schema/models');
const {_} = require('lodash');
const {logHistory} = require('../middleware/loghistory');
const {authenticate} = require('../middleware/authenticate');
const router = express.Router();
const DataFrame = require('dataframe-js').DataFrame;


router.get('/history', authenticate, function (req, res) {
    const user = req.user;
    if (user.history)
        res.send(user.history.reverse());
    else
        res.send({});
});

router.get('/request/verify', authenticate, function (req, res) {
    const members = req.user.members || [];
    console.log(members);
    Order.find({
        userId: {
            $in: members,
        },
        status: {
            $ne: 'Delivered',
        }
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

// Create Order
router.post('/', authenticate, function (req, res, next) {
    const id = req.user._id;
    let data = _.pick(req.body, ['address', 'materialType', 'quantity','contact','pincode','GST','name']);
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
            data._id = order._id;
            req.HISTORY = data;
            res.send({message: "Order Created"});
            next();
        }).catch((e) => {
            res.status(500).send({"error": e.message});
            console.log("Order not saved " + e);
        });
    }).catch((e) => {
        res.status(500).send({"error": e});
        console.log("user Not found " + e);
    });
}, logHistory);


//Update Order
router.put('/:id', authenticate, function (req, res, next) {
    const userId = req.user._id;
    const orderId = req.params["id"];
    const data = _.pick(req.body, ['location', 'status', 'driver']);
    console.log(data);
    let members = req.user.members || [];
    Order.find({
        userId: {
            $in: members,
        },
        _id: orderId,
    }).update({
        status: data.status,
        location: data.location,
        driver: data.driver,
    }).then((doc) => {
        res.send({message: 'Order ' + orderId + ' updated'});
        data._id = orderId;
        data.message = "Order Updated";
        req.HISTORY = data;
        next();
    }).catch((e) => {
        res.status(500).send(e);
    });
}, logHistory);


//Delete Order
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
        res.send(JSON.stringify(doc));
        data.message = "Order Deleted";
        data._id = orderId;
        req.HISTORY = data;
        next();
    }).catch((e) => {
        res.status(505).send(e);
    });
}, logHistory);

router.get('/track', authenticate, function (req, res) {
    const id = req.user._id;
    Order.find({
        status: {
            $ne: 'NotVerified',
        },
        userId: id
    }).sort({
        '_id': -1
    }).then((data) => {
        console.log(data);
        res.send(data);
    }).catch((e) => {
        res.status(505).send(e);
    });
});

router.get('/download', authenticate, function (req, res) {
    Order.find({
        userId: req.user._id,
        status: "NotVerified",
    }).sort({
        '_id': -1
    }).then((data) => {
        console.log(data);
        const df = new DataFrame(data, ['_id', 'name', 'address', 'pincode', 'contact', 'GST', 'materialType', 'quantity', 'status', 'location', 'driver.name', 'driver.contact']);
        df.toCSV(true, __dirname + '/a.csv');
        res.download(__dirname + '/a.csv', 'Download');
    }).catch((e) => res.send({error: e}));
});


module.exports = router;
