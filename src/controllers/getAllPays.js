const { Pay } = require("../db");
const getAllPays = async (req, res, next) => {
  try {
    const pays = await Pay.findAll();

    if(!pays) return res.status(200).json({message:"No hay pagos registrados"})
    
    return res.send(pays);
  } catch (error) {
    next(error);
  }
};

module.exports = getAllPays;