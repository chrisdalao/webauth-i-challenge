const db = require('../data/db-config.js');

module.exports = {
    // add,
    find,
    findBy,
    // findById,
};

function find() {
    return db('users').select('id', 'username', 'password');
}

function findBy(filter) {
    return db('users').where(filter);
}

