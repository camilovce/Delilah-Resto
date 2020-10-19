const { db } = require('./db');
const { routesProducts } = require('./models/products');
const { routesUsers } = require('./models/users');
const { routesOrders } = require('./models/orders');
const bodyParser = require('body-parser');
const express = require('express');
const server = express();
const cors = require('cors');
const moment = require('moment');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
routesProducts(server);
routesUsers(server);
routesOrders(server);
server.listen(3000, () => {
    db.authenticate()
        .then(data => {
            console.log(data)
        })
        .catch((error) => {
            console.log(error)
        });
});

console.log(moment().format('LT'));



