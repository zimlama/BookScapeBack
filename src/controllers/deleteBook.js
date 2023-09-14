const { Op } = require("sequelize");
const { Book } = require("../db");

const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.status(204).json({ message: "Deleted successfuly", success: true });
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    next(error);
  }
};

const getDeletedBooks = async (req, res, next) => {
  try {
    // Consulta todos los usuarios eliminados lógicamente
    const deletedBooks = await Book.findAll({
      paranoid: false, // Incluye registros eliminados lógicamente
      where: { deletedAt: { [Op.ne]: null } }, // Filtra registros con deletedAt no nulo
    });

    if (deletedBooks.length === 0) {
      return res
        .status(200)
        .json({ message: "No se encontraron libros eliminados" });
    }

    return res.status(200).json(deletedBooks);
  } catch (error) {
    next(error);
  }
};

module.exports = { deleteBook, getDeletedBooks };
