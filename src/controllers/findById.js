const { Book, Language, Author, Publisher, Review, Tag } = require("../db");

const findById = async (req, res, next) => {
  // console.log("Funcnion findById");
  try {
    const { id } = req.params;
    // console.log("id",id)
    const book = await Book.findByPk(id, {
      attributes: [
        "id_book",
        "title",
        "published_date",
        "price",
        "description",
        "rating_ave",
        "image",
      ],
      include: [
        {
          model: Tag,
          attributes: ["name"],
          through: {
            attributes: [],
          },
        },
        {
          model: Author,
          attributes: ["name"],
          through: {
            attributes: [],
          },
        },
        {
          model: Language,
          attributes: ["language"],
        },
      ],
    });
    res.send(book);
  } catch (error) {
    next(error);
  }
};
module.exports = findById;
