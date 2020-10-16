const { querySelector } = require('../db');
const { verifyToken, checkAdminOrId, checkAdmin } = require('../models/users');
const moment = require('moment');



// ********************GET ORDER ***************************************

const getO = async () => {
    // const query = `
    //     SELECT  state, time, payment, nombreProducto FROM ordenes 
    //     JOIN productosOrdenes ON ordenes.id = productosOrdenes.idOrdenes 
    //     JOIN productos ON productosOrdenes.idProductos = productos.id 
    // `;
    const query = `SELECT * FROM ordenes`;
    const result = await querySelector(query, true);
    return result[0];
}

const getOrders = async (req, res, next) => {
    try {
        const orders = await getO();
        console.log(orders);
        res.status(200).json({ data: orders });
    } catch (error) {
        next(error);
    }
}

const getOrderByIdQuery = async (id) => {
    // const query = `
    // SELECT  state, time, payment, nombreProducto FROM ordenes 
    // JOIN productosOrdenes ON ordenes.id = productosOrdenes.idOrdenes 
    // JOIN productos ON productosOrdenes.idProductos = productos.id 
    //     WHERE ordenes.id = :id;
    // `;
    const query = `SELECT * FROM ordenes
                   WHERE ordenes.id = :id;`;
    const result = querySelector(query, true, { id });
    return result[0];
}


const getOrderById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const order = await getOrderByIdQuery(id);
        res.status(200).json({ data: order });
    } catch (error) {
        next(error);
    }
}
/*  */// ********************GET ORDER ***************************************
/* *
*
*
*
***
**/
// ********************CREATE ORDER ***************************************

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
    return [orderDescription, iDsNoRepeated];
};

const createO = async (iDUser, orderBody) => {
    orderBody.userId = iDUser;
    const [orderDescription, iDsNoRepeated] = await descriptionCreator(orderBody.products);
    // orderBody.description = await descriptionCreator(orderBody.products)[0];
    orderBody.description = orderDescription;
    orderBody.products = iDsNoRepeated;
    orderBody.time = moment().format('LT');
    console.log(orderBody.description);
    const query = `
        INSERT INTO ordenes (time, description, payment, userId, total,address)
        VALUES (:time, :description, :payment, :userId, :total,address);
    `;

    const result = await querySelector(query, false, orderBody);

    const orderProductQuery = `
        INSERT INTO productosOrdenes (idOrdenes, idProductos)
        VALUES (:idOrdenes, :idProductos)
    `;

    orderBody.products.forEach(async idProductos => {
        await querySelector(orderProductQuery, false, { idOrdenes: result[0], idProductos });
    });

    return result[0];
}

const createOrder = async (req, res, next) => {
    const { id } = req.userData;
    (time, description, payment, userId, total)
    const { time, description, payment, total, products } = req.body;

    if (description && time && payment && total && products) {
        try {
            const orderId = await createO(id, req.body);
            res.status(201).json({ data: orderId });
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).json({ message: 'Missing some information!' });
    }
}
// ********************CREATE ORDER ***************************************
/* 
*
*
*
*
*
* */


/**
 ********************UPDATE ORDER***************************************
 */
const updateO = async (id, orderBody) => {
    const { state } = orderBody;
    const order = await getOrderById(id);
    const [orderDescription] = await descriptionCreator(order.products);
    const query = `
        UPDATE ordenes
        SET description = '${orderDescription || order.description}',
        state = '${state || order.state}'
        WHERE id = :id`;

    await querySelector(query, false, { id });
}

const updateOrder = async (req, res, next) => {
    const orderBody = req.body;
    const { id } = req.params;

    try {
        await updateO(id, orderBody);
        let newState = await getOrderById(id);
        res.status(200).json({ data: id, newState: newState.state });
    } catch (error) {
        next(error);
    }
}
/**
 ********************UPDATE ORDER***************************************
 *
 * *
 * 
 * 
 * 
 * 
 * 
 * */

/**
 ********************DELETE ORDER***************************************
 */
const deleteO = async (id) => {
    const query = 'DELETE FROM ResOrder WHERE id = :id';
    await database.executeQuery(query, false, { id });
}

const deleteOrder = async (req, res, next) => {
    const { id } = req.params;
    try {
        await deleteO(id);
        res.status(200).json({ delete: `Order number ${id} was succesfully delted!` })
    } catch (error) {
        next(error);
    }
}

/**
 ********************DELETE ORDER***************************************
**
*
**
*
*
*
**/
/**
 * 
 * ************** GET USER ORDERS**************************
 *  */
const getUserO = async (userId) => {
    const query = 'SELECT * FROM ordenes WHERE userId = :userId';
    const result = await querySelector(query, true, { userId });
    return result[0];
}
const getUserOrders = async (req, res, next) => {
    const { id } = req.params;

    try {
        const orders = await getUserO(id);
        res.status(200).json({ data: orders });
    } catch (error) {
        next(error);
    }
}
/**
 * 
 * ************** GET USER ORDERS**************************
 *  */

/**
 * 
 * 
 * *************GET ORDER PRODUCTS*************
 */
const getOrderP = async (orderId) => {
    const query = `
        SELECT nombreProducto, precio FROM productos
        JOIN productosOrdenes ON productos.id = productosOrdenes.idProductos
        WHERE productosOrdenes.idOrdenes = :orderId;
    `;
    const result = querySelector(query, true, { orderId });
    return result[0];
}

const getOrderProducts = async (req, res, next) => {
    const { id } = req.params;
    try {
        const products = await getOrderP(id);
        res.status(200).json({ data: products });
    } catch (error) {
        next(error);
    }
}

/**
 * 
 * 
 * *************GET ORDER PRODUCTS*************
 * 
 * 
 * 
 * 
 * 
 */

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





const verifyIfOrderExists = async (req, res, next) => {
    const { id } = req.params;
    try {
        const order = await getOrderByIdQuery(id);
        if (!order) {
            res.status(404).json({ error: `Order with id ${id} not found` });
        } else {
            next();
        }

    } catch (error) {
        next(error);
    }
}

// ******************************************************
// ******************************************************
// ******************************************************
// ******************************************************
// ******************************************************
// ******************************************************
// ******************************************************


/**
 * 
 * @param {import('express').Express} app 
 */

function routesOrders(app) {
    app.use('/ordenes', verifyToken);

    app.get('/ordenes', checkAdmin, getOrders);

    app.post('/ordenes', createOrder);

    app.get('/ordenes/:id', checkAdminOrId, verifyIfOrderExists, getOrderById);

    app.put('/ordenes/:id', checkAdminOrId, verifyIfOrderExists, updateOrder);

    app.delete('/ordenes/:id', checkAdminOrId, verifyIfOrderExists, deleteOrder);

    app.get('/ordenes/users/:id', verifyToken, checkAdminOrId, getUserOrders);

    app.get('/ordenes/:id/products', checkAdminOrId, verifyIfOrderExists, getOrderProducts);
}
module.exports = {
    routesOrders
}