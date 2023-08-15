const findAllBooks = async (req, res, next) => {
  try {
    var result = await Books.findAll({
      include: {
        model: Genre,
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
    });
    res.send(result);
  } catch (e) {
    next(e);
  }
};

const postBook = async (req, res, next) => {
  try {
    const { title, author, price, description, rating, image } = req.body;
    const newBook = await Recipe.create({
      title,
      author,
      price,
      description,
      rating,
      image,
    });
    let genreBook = await Genre.findAll({
      where: { name: genre },
    });
    newBook.addGenre(genreBook);
    res.status(200).send(newBook);
  } catch (error) {
    next(error);
  }
};
