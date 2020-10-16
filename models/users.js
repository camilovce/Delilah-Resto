const { db, querySelector } = require('../db');
const jwt = require('jsonwebtoken')
const verifyUseriD = async (id) => {
    let query = `SELECT * FROM usuarios WHERE id=:id`;
    let verification = await querySelector(query, true, { id });
    // console.log(verification)
    return verification;
}
// *************JWT TOKEN******************
const generateToken = async (user) => {
    let payload = {
        id: user.id,
        user: user.user,
        email: user.email,
        rol: user.rol
    };
    console.log('GENERATE');
    const vtoken = jwt.sign(payload, 'camilo123');
    return vtoken;
}

const verifyToken = async (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization && authorization.split(' ')[1];
    const userData = await jwt.verify(token, 'camilo123');
    // console.log(userData)
    if (userData) {
        req.userData = userData;
        next();
    } else {
        res.status(401).json({ message: 'Invalid token' });
    }
}
// *************JWT TOKEN******************
/* 
*
*
*
 */
// *************CHECK ADMIN*****************

const checkAdmin = (req, res, next) => {
    const { rol } = req.userData;
    if (rol === 'admin') {
        next();
    } else {
        res.status(401).json({ error: 'You have no rights to make this request' });
    }
}

const checkAdminOrId = async (req, res, next) => {
    const { id, rol } = req.userData;
    console.log(id)
    let parametro = req.params.userId;
    if (id == parametro || rol == 'admin') {
        next();
    } else {
        res.status(400).json({ error: "User has no privileges!" })
    }
}
// *************CHECK ADMIN*****************
/* 
*
*
*
 */
// *************LOGIN*****************

const verifyUserPass = async (user, password) => {
    let query = `SELECT * FROM usuarios WHERE user = :user AND password= :password`
    let resultado = await querySelector(query, true, { user, password });
    return resultado;
}

const login = async (req, res, next) => {
    const { user, password } = req.body;
    try {
        let logg = await verifyUserPass(user, password);
        let valuesUser = logg[0];
        let prueba = JSON.stringify(logg);
        if (prueba === '[]') {
            res.status(404).json({ error: `email or password are incorrect!` })
        } else {
            // console.log(logg)
            let objetoToken = {
                id: valuesUser.id,
                user: valuesUser.user,
                email: valuesUser.email,
                rol: valuesUser.rol
            };
            console.log('LOGIn')
            // console.log(objetoToken)
            let token = await generateToken(objetoToken);
            res.status(201).json({ data: token });
        }
    } catch (error) {
        next(error);
    }
}
// *************LOGIN*****************
/* *
*
*
*
* */

// ****************GET USERS**********************
const getUser = async (req, res) => {
    const { userId } = req.params;
    try {
        let consulta = await getUserById(userId);
        res.status(200).json({ data: consulta });
    } catch (error) {
        res.status(500).json({ error: "something went wrong" });
    }
}
const getUsers = async (req, res) => {
    let query = `SELECT * FROM usuarios`;
    try {
        let get = await querySelector(query, true);
        // console.log(get[1])
        res.status(200).json({ data: get });
    } catch (error) {
        res.status(500).json({ error: "something went wrong" });
    }
}
// ****************GET USERS**********************
/* 
*
*
*
*
 */
// ****************CREATE USER**********************
const getUserById = async (id) => {
    const query = 'SELECT * FROM usuarios WHERE id = :id;';
    const results = await querySelector(query, true, { id });
    // console.log(results)
    return results[0];
}
const getUserByEmail = async (email) => {
    const query = `SELECT * FROM usuarios WHERE email = :email`;
    const results = await querySelector(query, true, { email });
    return results[0];
}
const getUserByUsername = async (user) => {
    const query = `SELECT * FROM usuarios WHERE user = :user`;
    const results = await querySelector(query, true, { user });
    return results[0];
}
const createU = async (userdata) => {
    let query = `INSERT INTO usuarios (user, name,email, phone, address,password)
    VALUES (:user, :name, :email,:phone, :address, :password);`;
    const result = await querySelector(query, false, userdata);
    console.log('quiesta');
    console.log(result[0]);
    console.log('quiesta[0]');
    return result[0];
}

const createUser = async (req, res, next) => {
    const { user, name, email, phone, address, password } = req.body;
    if (user && name && email && phone && phone && address && password) {
        // console.log(user)
        let userName = await getUserByUsername(user);
        let userEmail = await getUserByEmail(email);

        if (userName) {
            res.status(409).json({ error: `${user} is already taken!` });
        } else if (userEmail) {
            res.status(409).json({ error: `${email} is already registered!` });
        } else {
            try {
                let userData = await createU(req.body);
                // console.log(userData);
                res.status(200).json({ data: "Usuario creado con 'exito!" });
            } catch (error) {
                res.status(400).json({ error: 'There was an error!' });
            }
        }
    } else {
        res.status(400).json({ error: 'Missing some data!' });
        next(error);
    }
}
// ****************CREATE USER**********************
/* 
*
*
*
*
 */

//  ***************UPDATE USERS***********************
const isUser = async (req, res, next) => {
    const { id, rol } = req.userData;
    if (rol === 'user' && req.params == id) {
        next();
    } else {
        res.status(401).json({ error: 'You have no rights to make this request' });
    }
}
const updateU = async (id, newDataUser) => {
    const { user, name, email, phone, address, password } = newDataUser;
    const usuario = await getUserById(id);
    console.log('UPDATEU')
    const query = `
    UPDATE usuarios
    SET user = '${user || usuario.user}',
    name = '${name || usuario.name}',
    email = '${email || usuario.email}',
    phone = '${phone || usuario.phone}',
    address = '${address || usuario.address}',
    password = '${password || usuario.password}'
    WHERE id = ${usuario.id}`;
    await querySelector(query)
}
const updateUser = async (req, res, next) => {
    const { userId } = req.params;
    const userData2 = req.body;
    const { id } = req.userData;

    try {
        if (userId == id) {
            await updateU(userId, userData2);
            res.status(200).json({ data: "Usuario actualizado con éxito!" });
        } else {
            res.status(404).json({ data: "El id ingresado no es valido!" });
        }
    } catch (error) {
        next(error);
    }
}
//  ***************UPDATE USERS***********************

/* 
*
*
*
*
 */
//  ***************DELETE USERS***********************

const deleteU = async (id) => {
    const query = `DELETE FROM usuarios WHERE id=${id}`;
    console.log(query)
    await querySelector(query);
}

const deleteUser = async (req, res, next) => {
    const { userId } = req.params;
    try {
        await deleteU(userId);
        res.status(200).json({ data: userId, info: "Usuario elminado con éxito!" });
    } catch (error) {
        next(error);
    }
}
//  ***************DELETE USERS***********************
/* *
*
*
*
* *******************************************************/
function routesUsers(app) {
    app.post('/usuarios/signin', login);
    app.get('/usuarios', verifyToken, checkAdmin, getUsers);
    app.post('/usuarios', createUser);
    app.put('/usuarios/:userId', verifyToken, checkAdmin, updateUser);
    app.delete('/usuarios/:userId', verifyToken, checkAdmin, deleteUser);
    app.get('/usuarios/:userId', verifyToken, checkAdminOrId, getUser);
}

module.exports = {
    routesUsers,
    isUser,
    verifyToken,
    checkAdminOrId
}