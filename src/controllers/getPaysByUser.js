const {conn, User, Pay } = require("../db"); // Asegúrate de importar tus modelos de la base de datos
const {QueryTypes} = require("sequelize")
const getPaysByUser = async (req, res, next) => {
  try {
    
    const {id} = req.params;

    if(!id) return res.status(400).json({message:"Se requiere un Id de Usuario"})

    // const user = await User.findOne({where: ['id::"varchar" like ?', `%${userId}%`]});

    const user = await conn.query(`
      SELECT u.id
      FROM "Users" u
      WHERE u.id::"varchar" LIKE '%${id}%';
      `,
      {
        raw: true,
        type:QueryTypes.SELECT
      }
    )

    console.log("id User: ", user);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const pays = await Pay.findAll({
      where: { UserId: id },
    });

    if(!pays) return res.status(200).json({message:"No hay pago redistrados para este usuario"})

    return res.send(pays);
  } catch (error) {
    next(error);
  }
};

module.exports = getPaysByUser;
