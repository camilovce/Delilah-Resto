
const autentircarUsuario = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verificarToken = jwt.verify(token, 'secretoJWT#shh');
        if (verificarToken) {
            req.usuario = verificarToken;
            return next();
        }
    } catch (err) {
        res.json({ error: 'Error al validar usuario' });
    }
}



module.exports = autentircarUsuario;