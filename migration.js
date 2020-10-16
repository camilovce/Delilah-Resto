const { db } = require('./db');


(async () => {
    // Users table
    await db.query(`CREATE TABLE IF NOT EXISTS usuarios
    (id INT PRIMARY KEY AUTO_INCREMENT, 
    user VARCHAR (60) UNIQUE NOT NULL,
    name VARCHAR (60) NOT NULL, 
    email VARCHAR (60) UNIQUE NOT NULL,  
    phone INT UNSIGNED NOT NULL, 
    address  VARCHAR(60) NOT NULL,
    password VARCHAR(60) NOT NULL,
    rol VARCHAR(60) DEFAULT ='user');`);
    // Products table
    await db.query(`CREATE TABLE IF NOT EXISTS productos
    (id INT PRIMARY KEY AUTO_INCREMENT, 
    nombreProducto VARCHAR (60) UNIQUE NOT NULL,
    precio INT UNSIGNED, 
    cantidad INT UNSIGNED);`
    );
    // Orders table
    await db.query(
        `CREATE TABLE IF NOT EXISTS ordenes
        (id INT PRIMARY KEY AUTO_INCREMENT,
        state VARCHAR(20) NOT NULL DEFAULT = 'NUEVO', 
        time VARCHAR(8) NOT NULL,
        description TEXT NOT NULL, 
        payment VARCHAR(8),
        userId INT UNSIGNED,
        total INT NOT NULL);`
    );
    // Orders and Products Table
    await db.query(
        `CREATE TABLE IF NOT EXISTS productosOrdenes
        (idProductos INT NOT NULL AUTO_INCREMENT,
        idOrdenes INT NOT NULL AUTO_INCREMENT,
        PRIMARY KEY(idProductos,idOrdenes)
    )` );

    // console.log(`Tablas Creadas con éxito!`)
    // const [ordenes] = await db.query(
    //     `SELECT * FROM productos`,
    //     { raw: true },
    // );
    // console.log(ordenes);
})();

