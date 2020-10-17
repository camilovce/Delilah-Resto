// const { verify } = require('jsonwebtoken');
const { querySelector, db } = require('../db');
const { verifyToken, checkAdminOrId, checkAdmin } = require('../models/users');
// *********************************************************
//**************** */ PRODUCT SERVICES*******************
// *********************************************************

// *********************EXISTS**********************
const verifyIfProductExistsById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const product = await getProductById(id);

        if (!product) {
            res.status(404).json({ error: `Product with id: ${id} does not exist! ` });
        } else {
            next();
        }

    } catch (error) {
        next(error);
    }
}

/**
 * Get all products.
 */

const getProducts = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM productos;';
        const consulta = await querySelector(query, true,);
        res.status(200).json({ data: consulta });
    } catch (error) {
        next(error);
    }
}
const getProductByName = async (nombreProducto) => {
    const query = 'SELECT * FROM productos WHERE nombreProducto = :nombreProducto;';

    const result = await querySelector(query, true, { nombreProducto });

    return result[0];
}

const getProductById = async (id) => {
    const query = 'SELECT * FROM productos WHERE id = :id;';
    const consulta = await querySelector(query, true, { id });
    if (consulta == 'undefined') {
        console.log('Product by given id does not exist!')
    } else {
        return consulta[0];
    }
}

const getProductsiD = async (req, res, next) => {
    try {
        const { id } = req.params;
        let resultado = await getProductById(id);
        res.status(200).json({ data: resultado });

        // const query = 'SELECT * FROM productos;';
        // const consulta = await querySelector(query, true,);
        // res.status(200).json({ data: consulta });
    } catch (error) {
        next(error);
    }
}
// app.get(`/productos`, getProducts);



// *************CREATING A PRODUCT****************
const createP = async (replacements) => {
    const query = `INSERT INTO productos (nombreProducto, precio, cantidad)
        VALUES (:nombreProducto, :precio, :cantidad);`;
    const result = await querySelector(query, false, replacements);
    return result[0];
}


const createProduct = async (req, res, next) => {
    const { nombreProducto, precio, cantidad } = req.body;
    console.log(req.body)

    try {
        const productName = await getProductByName(nombreProducto);
        console.log('asdfasdf')

        if (productName) {
            res.status(409).json({ error: `${nombreProducto} already exists` });
            return;
        }

        if (cantidad && nombreProducto && precio) {
            console.log('asdfasdf')
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
    await querySelector(query);
}

const updateProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        await modifyProduct(id, req.body);
        res.status(200).json({ data: id });
    } catch (error) {
        next(error);
    }
}

// *************MODIFY A PRODUCT****************


// *************DELETE A PRODUCT****************

const deleteP = async (id) => {
    const query = 'DELETE FROM productos WHERE id = :id;';
    try {
        await querySelector(query, false, { id });

    } catch (error) {
        console.log(error)
    }
}

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await deleteP(id);
        res.status(200).json({ data: id })
    } catch (error) {
        next(error);
    }
}




function routesProducts(app) {
    app.use('/productos', verifyToken);
    app.post('/productos', checkAdmin, createProduct);
    app.get('/productos', getProducts);
    app.delete('/productos/:id', checkAdmin, verifyIfProductExistsById, deleteProduct);
    app.get('/productos/:id', verifyIfProductExistsById, getProductsiD);
    app.put('/productos/:id', checkAdmin, verifyIfProductExistsById, updateProduct);
}
// *************DELETE A PRODUCT****************

module.exports = {
    verifyIfProductExistsById,
    getProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct,
    routesProducts,
};