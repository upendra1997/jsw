const {User} = require('../schema/models');

function parseCookies(request) {
    let list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function (cookie) {
        let parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

const authenticate = (req, res, next) => {
    const token = req.header('x-auth') || parseCookies(req)['x-auth'];
    User.findByToken(token).then((user) => {
        if (!token) {
            return Promise.reject();
        }
        if (!user) {
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send({error: "Can't find user with token"});
    });
};

module.exports = {authenticate};
