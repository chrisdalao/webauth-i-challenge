const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
Auth = require('./auth-model.js');

router.post('/register', (req, res) => {
    let user = req.body;

    if (user) {
        const hash = bcrypt.hashSync(user.password, 8)
        user.password = hash;
        Auth.add(user)
            .then(saved => {
                res.status(201).json(saved);
            })
            .catch(error => {
                res.status(401).json({ message: "Please provide a username and password" });
            });
    } else {
        res.status(500).json({ message: "There was an error registering user" });

    }
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Auth.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                res.status(200).json({ message: `Welcome ${user.username}!` });
            } else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

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