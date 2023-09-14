const { conn } = require("../db");
const {QueryTypes}= require("sequelize")

const findById = async (req, res, next) => {
  // console.log("Funcnion findById");
  try {
    const { id } = req.params;
    // console.log("id",id)
    const book = await conn.query(`
        SELECT
        b.id_book,
        b.title,
        b.published_date,
        b.price,
        b.description,
        AVG(r.rating) AS rating_ave,
        b.image,
        json_build_object('name', p.name, 'id', p.id) AS "Publisher", 
        (
          SELECT jsonb_agg(json_build_object('name', t.name, 'id', t.id))
          FROM "Tags" t
          WHERE t.id IN (
          SELECT tb."TagId"
          FROM tag_book tb
          WHERE tb."BookIdBook" = b.id_book
          )
        ) AS "Tags",
        (
          SELECT jsonb_agg(json_build_object('name', a.name, 'id', a.id))
          FROM "Authors" a
          WHERE a.id IN (
            SELECT ab."AuthorId"
            FROM author_book ab
            WHERE ab."BookIdBook" = b.id_book
          )
        ) AS "Authors",
        json_build_object('id', l.id, 'language', l.language, 'description', l.description) AS "Language"
        FROM "Books" b
        JOIN author_book ab ON b.id_book = ab."BookIdBook"
        JOIN "Authors" a ON ab."AuthorId" = a.id
        JOIN "Publishers" p ON b."PublisherId" = p.id
        JOIN "Languages" l ON b."LanguageId" = l.id
        JOIN tag_book tb ON b.id_book = tb."BookIdBook"
        JOIN "Tags" t ON tb."TagId" = t.id
        LEFT JOIN "Reviews" r ON b.id_book = r."BookId"
        WHERE b.id_book = ${id}
        GROUP BY b.id_book, p.id, p.name, l.id, l.language, l.description;
      `,
      {
        raw: true,
        type:QueryTypes.SELECT
      })
      if (!book) {
        return res.status(404).json({ message: "Not found!", book: book });
      }
      return res.status(200).json(book);
    } catch (error) {
      next(error);
    }
  };
  module.exports = findById;