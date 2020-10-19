# Delilah-Resto
Welcome to my RESTful API **_Delilah-Resto_** that emulates a common restaurant orders!

## Technologies used in this project
- Node JS (latest version)
- MySQL (for database)
## Node JS Libraries 

- body-parser v1.19.0, extract the entire body portion of an incoming request stream and exposes it on req.body.
- cors: v2.8.5, It is a mechanism to allow or restrict requested resources on a web server depend on where the HTTP request was initiated.
- jsonwebtoke: v8.5.1.
- nodemon: v2.0.5.
- moment: v2.29.1.
- nodemon: v2.0.5.
## Initialization
Once you had installed all Node JS libraries mentioned above you will need to run `server.js` either using nodemon dependency or just node. Afterwards you will neeed to create the tables on `delilah` database by running `migration.js` file on node environment. I added 2 .csv tables that contain some generic data to populate _productos_ and _usuarios_ table using MySQL Workbench tool "Import Wizard" and selecting the associated table.


`node server.js`

I have also added the 3 Postman collections in which all of the available endpoints of this project are stored. So you can open them using postman and there you go, most of the enpoints have have header presets and body examples that you can use, so no need to create body nor header authorization values.


_Note_: all parameters that you need to properly connect with the databe are located in `db.js`file.





Este es un proyecto desarrollado para el curso de Desarrollo Web FullStack de Acámica. Es un servicio de Backend - API REST con NodeJS y base de dátos MySQL
This is a project that In a REST environment, CRUD often corresponds to the HTTP methods POST, GET, PUT, and DELETE, respectively. These are the fundamental elements of a persistent storage system.

Throughout the rest of the article, we will recommend standards and response codes that are typically followed by developers when creating RESTful applications. Conventions may differ so feel free to experiment with different return values and codes as you become comfortable with the CRUD paradigm.

Imagine we are working with a system that is keeping track of meals and their corresponding prices for a restaurant. Let’s look at how we would implement CRUD operations.
