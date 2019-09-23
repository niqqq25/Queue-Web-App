const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

express()
    .use(express.static(__dirname + '/dist/'))
    .get('/clients.json', (req, res) => {
        res.send(require('./src/clients.json'));
    })
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
