const {
  User,
  ShoppingCart,
  Pay,
  Review,
  Favorite,
  Order,
  Book,
} = require("../db");
const bcrypt = require("bcrypt");
const { MY_SECRET } = process.env;
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

//CONFIGURACIONES ----------------------------------------
//nm i bcrypt
//npm i jsonwebtoken
//agrgar MY_SECRET=bookscape en .env
//--------------------------------------------------------

//Registro de un nuevo usuario -----------------------------------------------
const registerUser = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    //Verifica si el mail ya existe:
    const alreadyExistsMail = await User.findAll({
      where: { email: email },
    });
    if (alreadyExistsMail.length) {
      console.log("Email already registered");
      res.send("Email already registered");
      return;
    }

    //Verifica si el usuario ya existe:
    const alreadyExistsUsername = await User.findAll({
      where: { username: username },
    });

    if (alreadyExistsUsername.length) {
      console.log("Username already registered");
      res.send("Username already registered");
      return;
    }

    // Encriptar la contraseña:
    const saltRounds = 10; // Número de rondas de hashing
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      email: email,
      password: hashedPassword,
      username: username,
    });
    const cartToAssociate = await ShoppingCart.create();
    await cartToAssociate.setUser(newUser);

    console.log({
      message: "User created succesfully!",
      id: newUser.id,
      email: newUser.email,
    });

    res.send({
      message: "User created succesfully!",
      id: newUser.id,
      email: newUser.email,
    });
  } catch (error) {
    next(error);
  }
};

//Login de un usuario ya registrado
// puede iniciar sesion con username o email y contraseña--------------------------------------------
const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const userCheck = await User.findOne({
      where: {
        [Op.or]: [{ username: username }, { email: username }],
      },
    });

    //Verifica si el mail o usuario ingresado esta registrado:
    if (!userCheck) {
      return res.send("User not found");
    }

    // Comparar contraseñas usando bcrypt.compare()
    const passwordMatches = await bcrypt.compare(password, userCheck.password);

    //Verifica si la contraseña es correcta:
    if (!passwordMatches) {
      return res.send("Password does not match!");
    } else {
      const jwtToken = jwt.sign(
        {
          //creacion del token
          id: userCheck.id,
          email: userCheck.email,
        },
        MY_SECRET,
        { expiresIn: "12h" }
      );
      res.send({
        token: jwtToken,
        message: "Login succesfully!",
        id: userCheck.id,
        email: userCheck.email,
        username: userCheck.username,
      });
    }
  } catch (error) {
    next(error);
  }
};

//Buscar usuarios por username
//si no recibe ningun parametro devuelve todos los usuarios ----------------------------------------------

const getUsers = async (req, res, next) => {
  try {
    const { username } = req.query;
    if (username) {
      const searchUser = await User.findOne({
        include: [
          {
            model: ShoppingCart,
            attributes: ["cart_id"],
            include: Book,
          },
          {
            model: Favorite,
            attributes: ["BookId"],
          },
          {
            model: Review,
          },
          {
            model: Order,
          },
          {
            model: Pay,
          },
        ],
        where: {
          username: {
            [Op.iLike]: `%${username}%`,
          },
        },
        attributes: { exclude: ["password"] },
      });
      if (searchUser) res.send(searchUser);
      //Si no existe ese ususario:
      else res.send({ message: "Username user has not been found" });
    } else {
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
      });
      res.send(users);
    }
  } catch (error) {
    next(error);
  }
};

//Buscar usuarios por ID ----------------------------------------------
const searchUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const searchUser = await User.findByPk(id, {
      attributes: ["id", "email", "username"],
      include: [
        {
          model: ShoppingCart,
        },
        {
          model: Favorite,
        },
        {
          model: Review,
        },
        {
          model: Order,
        },
        {
          model: Pay,
        },
      ],
    });
    if (searchUser) res.send(searchUser);
    else res.send({ message: "ID User has not been found" });
  } catch (error) {
    next(error);
  }
};

//Borrado logico---> cambia el campo active de true a false ------------------------
const toggleUserActiveStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Buscar el usuario por ID
    const user = await User.findByPk(id);

    if (!user) {
      console.log("User not found");
      res.send("User not found");
      return;
    }

    // Cambiar el valor del campo 'active'
    const newActiveStatus = !user.active;
    user.active = newActiveStatus;
    await user.save();

    console.log(`User active status changed to ${newActiveStatus}`);
    res.send(`User active status changed to ${newActiveStatus}`);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  registerUser,
  loginUser,
  searchUserById,
  getUsers,
  toggleUserActiveStatus,
};