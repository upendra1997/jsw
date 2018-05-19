const express = require('express');
const {User} = require('../schema/models');
const {_} = require('lodash');
const {authenticate} = require('../middleware/authenticate');
const router = express.Router();


router.post('/signup', function (req, res) {
    const data = _.pick(req.body, ['name', 'email', 'contact', 'password', 'address', 'owner', 'kind']);
    const user = new User(data);
    user.save().then(() => {
        return user.generateToken();
    }).then((token) => {
        console.log("User Created");
        res.header('x-auth', token).send({message: 'User Created'});
    }).catch((e) => {
        res.status(400).send({error: e.message});
        console.log("Error creating user: ", e.message);
    });
});

router.post('/login', function (req, res) {
    const data = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(data.email, data.password).then(function (user) {
        if (user.status === "NotVerified") { // TODO: Change To Verified
            user.generateToken().then((token) => {
                res.header('x-auth', token).send({message: "User Logged in."});
            }).catch((e) => {
                console.log("Error generating Tokens :", e);
                res.status(500).send({error: "Error generating Tokens"});
            });
        }
    }).catch((e) => {
        console.log("User Not Found :", e);
        res.status(404).send({error: "User not found."})
    });
});

router.post('/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send({message: "user logged out"});
    }, () => {
        res.status(400).send({error: "Cannot logout"});
    });
});

router.post('/reset', (req, res) => {
    const data = _.pick(req.body, ['email']);
    User.findByCredentials(data.email, "", "reset").then((user) => {
        console.log("User found", user);
        user.generateToken('reset').then((token) => {
            //TODO: send email with the token
            console.log(token);
            console.log({message: "Mail sent with token"});
            res.send({message: "Mail sent with token"});
        });
    }).catch((e) => {
        console.log("User not found", e);
        res.status(404).send({error: "user not found "});
    });
});

router.post('/verify/:id', (req, res) => {
    const data = _.pick(req.body, ['password']);
    const token = req.params['id'];
    User.findByToken(token, 'reset').then((user) => {
        if (!user) {
            throw "User Not found";
        }
        console.log({message: "User found"});
        User.findOne(user).then((doc) => {
            doc.password = data.password;
            doc.save().then(() => {
                console.log("Password Updated");
                user.removeToken(token).then(() => {
                    console.log("Token removed");
                    res.send({message: "Password reset done"});
                }).catch((e) => {
                    console.log("Token not removed", e);
                });
            }).catch((e) => {
                console.log("Password not Updated", e);
            });
        }).catch((e) => {
            console.log({error: "Not able to reset password" + e});
            return res.send({error: "Not able to reset password" + e});
        });
    }).catch((e) => {
        console.log({error: "Token invalid" + e});
        return res.status(404).send({error: "Token invalid" + e});
    })
});

module.exports = router;
