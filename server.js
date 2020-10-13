const { db } = require('./db');
const { routes } = require('./models/products');
const { routesUsers } = require('./models/users');
const bodyParser = require('body-parser');
const express = require('express');
const server = express();
const cors = require('cors');
server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
routes(server);
routesUsers(server);
server.listen(3000, () => {
    db.authenticate()
        .then(data => {
            console.log(data)
        })
        .catch((error) => {
            console.log(error)
        });
});

// console.log('Tabla creada.');



