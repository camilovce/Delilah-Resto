const { db, querySelector } = require('../config/database');
const { verifyToken, checkAdminOrId } = require('../models/users');
const moment = require('moment');

/**
 * Get all orders.
 * @returns {Array} Orders array.
 */
const getOrders = async () => {
    const query = `
        SELECT  state, time, payment, nombreProducto FROM ordenes 
        JOIN productosOrdenes ON ordenes.id = productosOrdenes.idOrdenes 
        JOIN productos ON productosOrdenes.idProductos = productos.id 
    `;
    const result = await querySelector(query, true);
    return result[0];
}

const getOrderById = async (id) => {
    const query = `
    SELECT  state, time, payment, nombreProducto FROM ordenes 
    JOIN productosOrdenes ON ordenes.id = productosOrdenes.idOrdenes 
    JOIN productos ON productosOrdenes.idProductos = productos.id 
        WHERE ordenes.id = '2';
    `;
    const result = querySelector(query, true, { id });
    return result[0];
}

const addProduct = async (req, res) => {
    const orderProductQuery = `
    INSERT INTO productosOrdenes (idOrdenes, idProducto)
    VALUES (:idOrdenes, :idProducto)`;

    ` SELECT af.feature_name
FROM AutoFeature af
INNER JOIN Auto2AutoFeature a2af
ON af.auto_feature_id = a2af.auto_feature_id
WHERE a2af.auto_id = 7;`
        ` SELECT af.feature_name
FROM AutoFeature af
INNER JOIN Auto2AutoFeature a2af
ON af.auto_feature_id = a2af.auto_feature_id
WHERE a2af.auto_id = 7;`
}

function listAllProperties(o) {
    var objectToInspect;
    var result = [];

    for (objectToInspect = o; objectToInspect !== null;
        objectToInspect = Object.getPrototypeOf(objectToInspect)) {
        result = result.concat(
            Object.getOwnPropertyNames(objectToInspect)
        );
    }

    return result;
}

const descriptionCreator = async (productsiDsArray) => {
    let orderDescription = '';
    let productOrderName;
    var count = {};
    productsiDsArray.forEach(function (i) { count[i] = (count[i] || 0) + 1; });
    let lenghtObj = Object.keys(count).length;
    let iDsNoRepeated = listAllProperties(count).splice(0, lenghtObj);
    const query = `SELECT nombreProducto FROM productos WHERE id = :id`;
    iDsNoRepeated.forEach(async id => {
        productOrderName = await querySelector(query, true, id);
        orderDescription += count[iDsNoRepeated[i]] + 'x' + productOrderName[0].user + ' ';
    });
    return orderDescription;
};



const createOrder = async (iDUser, orderBody) => {
    orderBody.userId = iDUser;
    orderBody.description = await descriptionCreator(orderBody.products);
    console.log(orderBody.description);
    const query = `
        INSERT INTO ordenes (state, time, description, payment, userId, total)
        VALUES (:state, :time, :description, :payment, :userId, :total);
    `;
    const result = await querySelector(query, false, orderBody);
    const orderProductQuery = `
        INSERT INTO productosOrdenes (idOrdenes, idProducto)
        VALUES (:idOrdenes, :idProducto)
    `;
    orderBody.products.forEach(async productId => {
        await querySelector(orderProductQuery, false, { orderId: result[0], productId });
    });
    return result[0];
}

const createOrder = async (req, res, next) => {
    const { id } = req.userData;
    const { description, time, state, wayToPay, total, products } = req.body;

    if (description && time && state && wayToPay && total && products) {
        try {
            const orderId = await orderServices.createOrder(id, req.body);

            res.status(201).json({ data: orderId });
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).json({ message: 'Malformed body request' });
    }
}

/**
 * Update the order by the given id.
 * @param {String} id Order id.
 * @param {Object} orderProps 
 */
const updateOrder = async (id, orderProps) => {
    const { description, state } = orderProps;
    const order = await getOrderById(id);

    const query = `
        UPDATE ResOrder
        SET description = '${description || order.description}',
        state = '${state || order.state}'
        WHERE id = :id
    `;

    await database.executeQuery(query, false, { id });
}

/**
 * Delete an order with the given id.
 * @param {String} id Order id.
 */
const deleteOrder = async (id) => {
    const query = 'DELETE FROM ResOrder WHERE id = :id';

    await database.executeQuery(query, false, { id });
}

/**
 * Get all orders from the given user.
 * @param {String} userId User id.
 * @returns {Array} Orders array.
 */
const getUserOrders = async (userId) => {
    const query = 'SELECT * FROM ResOrder WHERE userId = :userId';
    const result = await database.executeQuery(query, true, { userId });

    return result;
}

/**
 * Get products from order.
 * @param {Number} orderId Order id.
 * @returns {Array} Order products list.
 */
const getOrderProducts = async (orderId) => {
    const query = `
        SELECT name, price FROM Product
        JOIN OrderProduct ON Product.id = OrderProduct.productId
        WHERE OrderProduct.orderId = :orderId;
    `;

    const result = database.executeQuery(query, true, { orderId });

    return result;
}

module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    getUserOrders,
    getOrderProducts
}

// *****************************************************************************
// ******************************************************
// ******************************************************
// ******************************************************
// ******************************************************

const orderServices = require('../services/orderServices');

/**
 * Get Orders from Database and return an array of Orders.
 * @param {import('express').Request} req Request object
 * @param {import('express').Response} res Response object
 * @param {import('express').NextFunction} next Next function
 */
const getOrders = async (req, res, next) => {
    try {
        const orders = await orderServices.getOrders();

        res.status(200).json({ data: orders });
    } catch (error) {
        next(error);
    }
}

/**
 * Get order by id.
 * @param {import('express').Request} req Request object
 * @param {import('express').Response} res Response object
 * @param {import('express').NextFunction} next Next function
 */
const getOrderById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const order = await orderServices.getOrderById(id);

        res.status(200).json({ data: order });
    } catch (error) {
        next(error);
    }
}

/**
 * Create a new order.
 * @param {import('express').Request} req Request object
 * @param {import('express').Response} res Response object
 * @param {import('express').NextFunction} next Next function
 */
const createOrder = async (req, res, next) => {
    const { id } = req.userData;
    const { description, time, state, wayToPay, total, products } = req.body;

    if (description && time && state && wayToPay && total && products) {
        try {
            const orderId = await orderServices.createOrder(id, req.body);

            res.status(201).json({ data: orderId });
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).json({ message: 'Malformed body request' });
    }
}

/**
 * Update an order.
 * @param {import('express').Request} req Request object
 * @param {import('express').Response} res Response object
 * @param {import('express').NextFunction} next Next function
 */
const updateOrder = async (req, res, next) => {
    const orderProps = req.body;
    const { id } = req.params;

    try {
        await orderServices.updateOrder(parseInt(id), orderProps);

        res.status(200).json({ data: id });
    } catch (error) {
        next(error);
    }
}

/**
 * Delete an order.
 * @param {import('express').Request} req Request object
 * @param {import('express').Response} res Response object
 * @param {import('express').NextFunction} next Next function
 */
const deleteOrder = async (req, res, next) => {
    const { id } = req.params

    try {
        await orderServices.deleteOrder(id);

        res.status(200).json({ data: id });
    } catch (error) {
        next(error);
    }
}

/**
 * Get orders from the given user.
 * @param {import('express').Request} req Request object
 * @param {import('express').Response} res Response object
 * @param {import('express').NextFunction} next Next function
 */
const getUserOrders = async (req, res, next) => {
    const { id } = req.params;

    try {
        const orders = await orderServices.getUserOrders(id);

        res.status(200).json({ data: orders });
    } catch (error) {
        next(error);
    }
}

/**
 * Get all products from the given order.
 * @param {import('express').Request} req Request object
 * @param {import('express').Response} res Response object
 * @param {import('express').NextFunction} next Next function
 */
const getOrderProducts = async (req, res, next) => {
    const { id } = req.params;

    try {
        const products = await orderServices.getOrderProducts(id);

        res.status(200).json({ data: products });
    } catch (error) {
        next(error);
    }
}

/**
 * Middleware to verify if a product already exists.
 * @param {import('express').Request} req Request object
 * @param {import('express').Response} res Response object
 * @param {import('express').NextFunction} next Next function
 */
const verifyIfOrderExists = async (req, res, next) => {
    const { id } = req.params;

    try {
        const order = await orderServices.getOrderById(id);

        if (!order) {
            res.status(404).json({ error: `Order with id ${id} not found` });
        } else {
            next();
        }

    } catch (error) {
        next(error);
    }
}

module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    getUserOrders,
    verifyIfOrderExists,
    getOrderProducts
};

// ******************************************************
// ******************************************************
// ******************************************************
// ******************************************************
// ******************************************************
// ******************************************************
// ******************************************************


const orderController = require('../controller/orderController');
const userController = require('../controller/userController');
const authController = require('../controller/authController');

/**
 * 
 * @param {import('express').Express} app 
 */
module.exports = (app) => {
    app.use('/orders', verifyToken);

    app.get('/orders', checkAdminOrId, orderController.getOrders);

    app.post('/orders', orderController.createOrder);

    app.get('/orders/:id', checkAdminOrId,
        orderController.verifyIfOrderExists, orderController.getOrderById);

    app.put('/orders/:id', checkAdminOrId,
        orderController.verifyIfOrderExists, orderController.updateOrder);

    app.delete('/orders/:id', checkAdminOrId,
        orderController.verifyIfOrderExists, orderController.deleteOrder);

    app.get('/orders/users/:id', authController.verifyToken, checkAdminOrId,
        userController.verifyIfUserExistsById, orderController.getUserOrders);

    app.get('/orders/:id/products', checkAdminOrId,
        orderController.verifyIfOrderExists, orderController.getOrderProducts);
}