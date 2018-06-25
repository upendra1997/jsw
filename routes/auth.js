const {env} = require("../config");
const express = require('express');
const {User} = require('../schema/models');
const {_} = require('lodash');
const {authenticate} = require('../middleware/authenticate');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/signup', function (req, res) {
    const data = _.pick(req.body, ['name', 'email', 'contact', 'password', 'address', 'owner', 'kind']);
    const user = new User(data);
    user.save().then(() => {
        console.log("User Created");
        user.generateToken('verify').then((t) => {
            console.log("verification token generated " + t);
             /*Send mail*/

            // const mg = new Mailgun({apiKey: env['mailgun-api-key'], domain: env['mailgun-domain']});
            // const msg = {
            //     "from": env["username"],
            //     "to": data['email'],
            //     "subject": 'JSW Dealer and Sub-Delaer account verification',
            //     "html": 'please go to http://'+env['HOST']+':'+env['PORT']+'/verify/'+t,
            // };
            //
            // mg.messages().send(msg, function(err,body){
            //    if(err) console.log(err);
            //    else console.log(body);
            // });


            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: env['username'],
                    pass: env['password']
                }
            });
            const port = (process.env['NODE_ENV']==='production')?'':':'+env['PORT'];
            const mailOptions = {
                from: env['username'],
                to: data['email'],
                subject: 'JSW Dealer and Sub-Delaer account verification',
                text: 'please go to http://'+env['HOST']+port+'/verify/'+t,
            };
            console.log('please go to http://'+env['HOST']+':'+env['PORT']+'/verify/'+t)
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            /*mail end*/
        }).catch((e) => {
            console.log("verification token generation failed " + e);
        });
        res.send({message: 'User Created'});
    }).catch((e) => {
        res.status(409).send({error: e.message});
        console.log("Error creating user: ", e.message);
    });
});

router.post('/login', function (req, res) {
    const data = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(data.email, data.password).then(function (user) {
        if (user.status === "Verified") {
            user.generateToken().then((token) => {
                res.setHeader('Set-Cookie', ['x-auth=' + token]);
                user = _.pick(user, ['_id', 'address', 'contact', 'email', 'kind', 'owner', 'members', 'name', 'status']);
                console.log(user);
                res.header('x-auth', token).send({user, message: "User Logged in."});
            }).catch((e) => {
                console.log("Error generating Tokens :", e);
                res.status(500).send({error: "Error generating Tokens"});
            });
        }
        else {
            res.status(401).send({error: "User Not Verified"});
        }
    }).catch((e) => {
        console.log("User Not Found :", e);
        res.status(404).send({error: "User not found."})
    });
});

router.post('/check', authenticate, function (req, res) {
    const data = _.pick(req.body, ['email', 'password']);
    console.log(data);
    User.findByCredentials(data.email, data.password).then(function (user) {
        if (user.status === "Verified") {
            res.status(200).send({message: 'user exists'});
        }
        else {
            res.status(401).send({error: "User Not Verified"});
        }
    }).catch((e) => {
        console.log("User Not Found :", e);
        res.status(404).send({error: "User not found."})
    });
});

router.post('/changepassword', authenticate, function (req, res) {
    const data = _.pick(req.body, ['email', 'password']);
    const user = req.user;
    console.log("password entered " + data.password);
    user.password = data.password;
    user.save();
    res.status(200).send({message: 'Password Changed'})
});


router.get('/info/:id', function (req, res) {
    const id = req.params["id"];
    User.findById(id).then((user) => {
        const a = _.pick(user, ['name', 'email', 'contact', 'address', 'kind', 'members', 'owner']);
        console.log(user.name + " " + id + " " + user.members);
        res.status(200).send(a);
    }).catch((e) => {
        console.log(e.message);
        res.status(404).send({error: e.message});
    });
});


router.post('/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.setHeader('Set-Cookie', ['x-auth=']);
        res.status(200).send({message: "user logged out"});
    }, () => {
        res.status(500).send({error: "Cannot logout"});
    });
});

router.post('/reset', (req, res) => {
    const data = _.pick(req.body, ['email']);
    User.findByCredentials(data.email, "", "reset").then((user) => {
        console.log("User found", user);
        user.generateToken('reset').then((token) => {
            /*Send mail*/
            function randomPass() {
                let text = "";
                const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (let i = 0; i < 8; i++)
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                return text;
            }
            const pass = randomPass();
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: env['username'],
                    pass: env['password']
                }
            });
            const port = (process.env['NODE_ENV']==='production')?'':':'+env['PORT'];
            const mailOptions = {
                from: env['username'],
                to: data['email'],
                subject: 'JSW Dealer and Sub-Delaer account verification',
                text: 'please go to http://'+env['HOST']+port+'/reset/'+token+'/'+pass+' for new password '+pass+'',
            };
            console.log('please go to http://'+env['HOST']+':'+env['PORT']+'/reset/'+token+'/'+pass)
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            /*mail end*/
            console.log(token);
            console.log({message: "Mail sent with token"});
            res.send({message: "Mail sent with token"});
        });
    }).catch((e) => {
        console.log("User not found", e);
        res.status(404).send({error: "user not found "});
    });
});

router.get('/reset/:id/:password', (req, res) => {
    const pass = req.params['password']
    const token = req.params['id'];
    User.findByToken(token, 'reset').then((user) => {
        if (!user) {
            throw "User Not found";
        }
        console.log({message: "User found"});
        User.findOne(user).then((doc) => {
            doc.password = pass;
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

router.get('/verify/:id', (req, res) => {
    const token = req.params['id'];
    User.findByToken(token, 'verify').then((user) => {
        if (!user) {
            throw "User Not found";
        }
        user.status = "Verified";
        user.save().then(() => {
            user.removeToken(token).then(() => {
                console.log("Token removed");
                res.send({message: "User Verified"});
            }).catch((e) => {
                console.log("Token removal failed", e);
                return res.status(404).send({error: "Token removal failed" + e});
            });
        }).catch((e) => {
            console.log("User verification failed");
            return res.status(404).send({error: "User verification failed" + e});
        });
    }).catch((e) => {
        console.log({error: "Token invalid" + e});
        return res.status(404).send({error: "Token invalid" + e});
    });
});

module.exports = router;
