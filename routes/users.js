const express = require('express');
const {Order, User} = require('../schema/models');
const {_} = require('lodash');
const {logHistory} = require('../middleware/loghistory');
const {authenticate} = require('../middleware/authenticate');
const router = express.Router();


router.get('/', authenticate, function (req, res) {
    let user = _.pick(req.user, ['status', 'members','kind','_id','name','email','contact','address'])
    console.log(user);
    res.send(user);
});


router.get('/request',authenticate, function(req, res){
    let members = req.user.members || [];
    console.log(members);
    res.send(members);
});

module.exports = router;
