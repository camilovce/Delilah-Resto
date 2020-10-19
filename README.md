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
Once you had installed all Node JS libraries mentioned above you will need to run `server.js` either using nodemon dependency or just node. Afterwards you will neeed to create the tables on `delilah` database by running `migration.js` file on node environment. I added 2 .csv tables that contain some generic data to populate _productos_ and _usuarios_ tables. One method to achieve it is by using MySQL Workbench tool "Import Wizard" and selecting the associated table.


`node server.js`

I have also added the 3 Postman collections in which all of the available endpoints of this project are stored. You can open the files by using postman and there you go, most of the enpoints have have header presets and body examples that you can use, so no need to create body nor header authorization values.


_Note_: all parameters that you need to properly connect with the databe are located in `db.js`file.

## Endpoints
For all endpoints that I created I used the next port and host URL

```javascript
127.0.0.1:3000/
```
and for all the upcoming examples I gonna use the mentioned URL, but you can change any value if you prefer so.
### Users
#### Create an user
To create an user you just need a body
###### Method:
```
###### GET
```
###### URL
```
127.0.0.1:3000/usuarios
```
###### Body structure:

```
{
    "user": "andres23f3",
    "name": "camilo valbuena4",
    "email": "camilo@gmail.com",
    "phone": "31934824010",
    "address": "DG 59 11 A 90",
    "password": "camilo1234"
}
```
#### Login
One of the main endpoints is the login. It allows you to obtain a json web token to implemen in the majority of the other endpoints. 
It will not work if you enter password, user or email incorrectly. In this case `user` property can be both "email" or "user" values.
###### Method:
```
###### POST
```
###### URL
```
127.0.0.1:3000/usuarios
```
###### Body structure:

```
{
    "user": "camilov",
    "password": "camilo1234"
}
```
OR
```
{
    "user": "milo@gmail.com",
    "password": "camilo1234"
}




