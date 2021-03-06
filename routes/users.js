const express = require('express');
const {Order, User} = require('../schema/models');
const {_} = require('lodash');
const {logHistory} = require('../middleware/loghistory');
const {authenticate} = require('../middleware/authenticate');
const router = express.Router();


router.get('/', authenticate, function (req, res) {
    let user = _.pick(req.user, ['status', 'owner', 'members', 'kind', '_id', 'name', 'email', 'contact', 'address']);
    res.send(user);
});


router.get('/request',authenticate, function(req, res){
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
        },
        status: 'Verified',
    }).then(users => {
        res.send(users);
    });

});

router.get('/request/accept/:id', authenticate, function (req, res) {
    const id = data = req.params.id;
    const user = req.user;
    User.findById(id).then(USER => {
        USER.owner = String(user.id);
        USER.save();
    });
    user.members.push(String(id));
    user.save();
    res.send({});
});


module.exports = router;
