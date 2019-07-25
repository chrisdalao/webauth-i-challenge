const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
    let user = req.body;

    if (user.username && user.password) {
        const hash = bcrypt.hashSync(user.password, 8)
        user.password = hash;
        Users.add(user)
            .then(saved => {
                res.status(201).json(saved);
            })
            .catch(error => {
                res.status(401).json({ message: "That username already exists" });
            });
    } else {
        res.status(500).json({ message: "Please provide a username and password" });
    }
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;
    Users
    Users.findBy({ username })
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
    Users.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});

function authenticate(req, res, next) {
    const { username, password } = req.headers;

    Users.findBy({ username })
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