const express = require('express');
const {Order, User} = require('../schema/models');
const {_} = require('lodash');
const {logHistory} = require('../middleware/loghistory');
const {authenticate} = require('../middleware/authenticate');
const router = express.Router();


router.get('/', authenticate, function (req, res) {
    let user = _.pick(req.user, ['status', 'members', 'kind', '_id', 'name', 'email', 'contact', 'address']);
    console.log(user);
    res.send(user);
});


router.get('/request',authenticate, function(req, res){
    // let members = req.user.members || [];
    // console.log(members);
    const kind = {
        'admin': ['admin', 'dealer'],
        'dealer': ['sub-dealer'],
    };
    const user = req.user;
    User.find({
        _id: {
            $ne: user._id,
        },
        owner: {
            $in: [undefined, null, ''],
        },
        kind: {
            $in: kind[user.kind]
        }
        ,//TODO: add status
    }).then(users => {
        console.log(users);
        res.send(users);
    });

});

router.get('/request/accept/:id', authenticate, function (req, res) {
    const id = data = req.params.id;
    const user = req.user;
    User.findById(id).then(USER => {
        USER.owner = String(user.id);
        USER.save();
        console.log(USER);
    });
    user.members.push(String(id));
    user.save();
    console.log(user);
    res.send({});
});


module.exports = router;
