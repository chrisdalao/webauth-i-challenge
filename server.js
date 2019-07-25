const express = require('express');

const authRouter = require('./auth/auth-router');

const server = express();

server.use(express.json());
server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
    res.send('<h1>Auth Challenge</h1>')
})

module.exports = server;