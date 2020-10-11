const { Sequelize } = require('sequelize');
// const sequelize = new Sequelize('mysql://user:pass@host:port/database');
const db = new Sequelize("Delilah", "root", "Camilo123", {
    dialect: "mysql",
    host: "localhost",
    port: 3306,
});

// Use QueryTypes SELECT Method whenever is needed
const querySelector = async (query, selectQ = false, replacements = {}) => {
    console.log(selectQ);
    let typeQ;
    if (selectQ) {
        typeQ = db.QueryTypes.SELECT;
    } else {
        typeQ = undefined;
    }
    let consulta = await db.query(query, {
        type: typeQ,
        raw: true,
        replacements
    })
    return consulta;
}

module.exports = {
    db,
    querySelector
};