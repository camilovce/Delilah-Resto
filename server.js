const { db } = require('./db');
const { routes } = require('./products');
const express = require('express');
const server = express();

server.listen(3000, () => {
    db.authenticate()
        .then(data => {
            console.log(data)
        })
        .catch((error) => {
            console.log(error)
        });
});

console.log('Tabla creada.');



