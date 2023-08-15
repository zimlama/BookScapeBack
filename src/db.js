require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST,RW_USERdb,RW_PORTdb} = process.env;

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/bookstore`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
);

// // Conectar con la DB remota (Railway)
// const sequelize = new Sequelize(
//   `postgresql://postgres:${RW_USERdb}@containers-us-west-155.railway.app:${RW_PORTdb}/railway`,
//   {
//     logging: false, // set to console.log to see the raw SQL queries
//     native: false, // lets Sequelize know we can use pg-native for ~30% more speed
//   }
// );

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));   
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
console.log(sequelize.models);
const {
  Book,
  Review,
  User,
  Pay,
  Favorite,
  ShoppingCart,
  Order,
  Detail,
  Language,
  Publisher,
  Tag,
  Author
} = sequelize.models;
//!Revisar todas las relaciones hasMany y pasar a belongto()
// Aca vendrian las relaciones
//Language.hasMany(Book); //agrega el id Language a book
//Book.hasOne(Language) //llave foranea definida en Language 
Book.belongsTo(Language,{foreignKey:'LanguageId'})

Publisher.hasMany(Book); //agrega el id Publisher a book

Book.hasMany(Favorite); //agrega el id Book a Favorite
Favorite.hasOne(Book); // llave foranea definida en book 

User.hasMany(Favorite); //agrega el id User a Favorite

Book.hasMany(Review);
Review.hasOne(Book);

Book.belongsToMany(Author, { through: "author_book" }); //Crea tabla intermedia
Author.belongsToMany(Book, { through: "author_book"}); //Crea tabla intermedia

Book.belongsToMany(Tag, { through: "tag_book" }); //Crea tabla intermedia
Tag.belongsToMany(Book, { through: "tag_book"}); //Crea tabla intermedia

Book.belongsToMany(ShoppingCart, { through: "shopping_book" }); //Crea tabla intermedia
ShoppingCart.belongsToMany(Book, { through: "shopping_book"}); //Crea tabla intermedia

User.hasMany(Pay);
Pay.hasOne(User);

User.hasMany(Order);
Order.hasOne(User);

Order.hasMany(Detail);
Detail.hasOne(Order);

Order.hasOne(Pay);
Pay.hasOne(Order);

User.hasOne(ShoppingCart);

User.hasMany(Review);
Review.hasOne(User)
/////////////////////////////////////////////////////////////////////
module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
