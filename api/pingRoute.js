const { Router } = require('express');

module.exports = new Router()
    .get('/', (_, res) => {
        res.json('pong');
    })
