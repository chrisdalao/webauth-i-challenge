const express = require('express');
const router = express.Router();
Auth = require('./auth-model.js');

router.get('/users', authenticate, (req, res) => {
    Auth.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});

function authenticate(req, res, next) {
    const { username, password } = req.headers;

    Auth.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                next(); // pressing the button to let the request continue
            } else {
                res.status(401).json({ message: 'You shall not pass!!' });
            }
        })
        .catch(error => {
            res.status(500).json({ message: "You don't have any headers" });
        });
}

module.exports = router;