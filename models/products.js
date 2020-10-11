// const { query } = require('express');
const { db } = require('../db');

// db = require('./db');

// (async () => {
//     await db.query(
//         'CREATE TABLE IF NOT EXISTS usuarios (id INT PRIMARY KEY AUTO_INCREMENT, email VARCHAR (60) UNIQUE NOT NULL, nombre VARCHAR (60) NOT NULL,  edad INT UNSIGNED NOT NULL)',
//         { raw: true },
//     );
//     console.log('escuchando!');


// })();



// const crearP = async () => {
//     await db.query(
//         `SELECT* FROM `
//     );
// };


// *********************************************************
//**************** */ PRODUCT SERVICES*******************
// *********************************************************

// *********************EXISTS**********************
const verifyIfProductExistsById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const product = await productServices.getProductById(id);

        if (!product) {
            res.status(404).json({ error: `Product with id: ${id} does not exist! ` });
        } else {
            next();
        }

    } catch (error) {
        next(error);
    }
}


// const Product = require('../model/Product');
const database = require('../db');

/**
 * Get all products.
 */

async function getProducts(req, res, next) {
    try {
        const query = 'SELECT * FROM productos;';
        const consulta = await db.querySelector(query, true);
        res.status(200).json({ data: consulta });
    } catch (error) {
        next(error);
    }
}
app.get(`/productos`, getProducts);

const getProductById = async (id) => {
    const query = 'SELECT * FROM Product WHERE id = :id;';
    const consulta = await db.querySelector(query, true, { id });
    return consulta[0];
}

// *************CREATING A PRODUCT****************
const createP = async (replacements) => {
    const query = `INSERT INTO productos (nombreProducto, precio, cantidad)
        VALUES (:nombreProducto, :precio, :cantidad);`;
    const result = await db.querySelector(query, false, replacements);
    return result[0];
}

const createProduct = async (req, res, next) => {
    const { nombreProducto, precio, cantidad } = req.body;

    try {
        const productName = await createP(nombreProducto);

        if (productName) {
            res.status(409).json({ error: `${nombreProducto} already exists` });
            return;
        }

        if (cantidad && nombreProducto && precio) {
            const productId = await createP(req.body);
            res.status(201).json({ data: productId });
        } else {
            res.status(400).json({ error: 'Missing some information' });
        }

    } catch (error) {
        next(error);
    }
}
// app.post('/productos', createProduct);
// *************CREATING A PRODUCT****************
/* 
*
*
*
*
*
 */


// *************MODIFY A PRODUCT****************
const modifyProduct = async (id, replacements) => {
    const { nombreProducto, precio, cantidad } = replacements;
    const product = await getProductById(id);
    const query = `
        UPDATE productos
        SET nombreProducto = '${nombreProducto || product.nombreProducto}',
        precio = ${precio || product.precio},
        cantidad = ${cantidad || product.cantidad}
        WHERE id = ${id};`;
    await db.querySelector(query);
}

const updateProduct = async (req, res, next) => {
    const { productId } = req.params;
    try {
        await modifyProduct(productId, req.body);
        res.status(200).json({ data: productId });
    } catch (error) {
        next(error);
    }
}
// app.put('/products/:id', userController.verifyUserIdRequestAndRole,
//     productController.verifyIfProductExistsById, productController.updateProduct);
// app.put('/products/:id', verifyIfProductExistsById, updateProduct);

// *************MODIFY A PRODUCT****************


// *************DELETE A PRODUCT****************

const deleteProduct = async (id) => {
    const query = 'DELETE FROM Product WHERE id = :id;';
    try {
        await db.querySelector(query, false, { id });

    } catch (error) {
        console.log(error)
    }
}

function routes(app) {
    app.delete('/productos/:id', verifyIfProductExistsById, deleteProduct);
    app.put('/products/:id', verifyIfProductExistsById, updateProduct);
    app.post('/productos', createProduct);
    app.get('/productos', getProducts);

}
// app.delete('/productos/:id', verifyIfProductExistsById, deleteProduct);
// *************DELETE A PRODUCT****************

module.exports = {
    verifyIfProductExistsById,
    getProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct,
    routes,
};