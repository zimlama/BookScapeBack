const { Book, Publisher, Author, Language, Tag } = require("../db");
const cloudinary = require("../utils/cloudinary");

const createBook = async (req, res, next) => {
  try {
    const {
      isbn,
      title,
      published_date,
      price,
      description,
      page_count,
      url,
      publisher,
      authors,
      language,
      tags,
    } = req.body;

    if (req.file === null) {
      return;
    }
    if (title.length === 0 || isbn.length === 0 || price.length === 0)
      return res.send("Titulo, ISBN y precio son requeriods");

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No se cargaron archivos.");
    }

    const file = await cloudinary(req.files.image.tempFilePath);
    console.log(file, "file");
    image = file;

    // Publisher
    let publisherBody = await Publisher.findOne({
      where: { name: publisher },
    });

    if (!publisherBody) {
      publisherBody = await Publisher.create({ name: publisher });
    }

    // Language
    let languageBody = await Language.findOne({
      where: { language },
    });

    if (!languageBody) {
      languageBody = await Language.create({ language });
    }

    // Authors
    const authorNames = Array.isArray(authors) ? authors : [authors]; // Convierte en arreglo si no lo es

    const authorsBody = await Promise.all(
      authorNames.map(async (authorName) => {
        let author = await Author.findOne({
          where: { name: authorName },
        });

        if (!author) {
          author = await Author.create({ name: authorName });
        }

        return author;
      })
    );

    // Tags
    const tagNames = Array.isArray(tags) ? tags : [tags]; // Convierte en arreglo si no lo es

    const tagsBody = await Promise.all(
      tagNames.map(async (tagName) => {
        let tag = await Tag.findOne({
          where: { name: tagName },
        });

        if (!tag) {
          tag = await Tag.create({ name: tagName });
        }

        return tag;
      })
    );

    // Create Book
    const newBook = await Book.create({
      isbn,
      title,
      published_date,
      price,
      description,
      page_count,
      image,
      url,
      PublisherId: publisherBody.id,
      LanguageId: languageBody.id,
    });

    await newBook.setAuthors(authorsBody);
    await newBook.setTags(tagsBody);

    console.log(newBook, "nuwvo libro");

    res.send({
      message: "Book created successfully!",
      newBook,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = createBook;
