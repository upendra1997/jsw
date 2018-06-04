const logHistory = (req, res) => {
    console.log("Well");
    console.log(req.HISTORY.message);
    req.HISTORY.date = new Date();
    req.user.update({
        $push: {
            history: req.HISTORY,
        },
    }).then(() => {
        console.log("Logged");
    }).catch((e) => {
        console.log(e);
    });
};

module.exports = {logHistory};
