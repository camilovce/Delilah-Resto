const { db, querySelector } = require('./db');


// Users table
(async () => {
    let users = await db.query(`CREATE TABLE IF NOT EXISTS usarios
    (id INT PRIMARY KEY, 
    user VARCHAR (60) UNIQUE NOT NULL,
    name VARCHAR (60) UNIQUE NOT NULL, 
    email VARCHAR (60) UNIQUE NOT NULL,  
    phone INT UNSIGNED NOT NULL, 
    address  VARCHAR(60) NOT NULL );`);
    // Products table
    let products = await db.query(`CREATE TABLE IF NOT EXISTS productos
    (id INT PRIMARY KEY, 
    nombreProducto VARCHAR (60) UNIQUE NOT NULL,
    precio INT UNSIGNED, 
    cantidad INT UNSIGNED);`
    );
    // Orders table
    let orders = await db.query(
        `CREATE TABLE IF NOT EXISTS ordenes
        (id INT PRIMARY KEY,
        state VARCHAR(20) NOT NULL, 
        time VARCHAR(8) NOT NULL,
        description TEXT NOT NULL, 
        payment VARCHAR(8),
        userId INT UNSIGNED,
        total INT NOT NULL);`
    );
    // Orders and Products Table
    await db.query(
        `CREATE TABLE IF NOT EXISTS productosOrdenes
        (idProductos INT NOT NULL,
        idOrdenes INT NOT NULL ,
        PRIMARY KEY(idProductos,idOrdenes)
    )` );

    console.log(`Tablas Creadas con éxito!`)
    const [ordenes] = await db.query(
        `SELECT * FROM productos`,
        { raw: true },
    );
    console.log(ordenes);
})();

