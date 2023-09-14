const { conn } = require("../db");
const { QueryTypes } = require("sequelize");

const allBooks = async (req, res, next) => {
  try {
    const { target } = req.query;

    if (!target) {
      const allBooksDB = await conn.query(`
        SELECT
          b.id_book,
          b.isbn,
          b.title,
          b.published_date,
          b.price,
          b.description,
          AVG(r.rating) AS rating_ave,
          b.image,
          b.page_count,
          b.url,
          (
            SELECT jsonb_agg(json_build_object('name', a.name))
            FROM "Authors" a
            WHERE a.id IN (
            SELECT ab."AuthorId"
            FROM author_book ab
            WHERE ab."BookIdBook" = b.id_book
            )
          ) AS "Authors",
          json_build_object('name', p.name) AS "Publisher", 
          json_build_object('language', l.language) AS "Language", 
          (
            SELECT jsonb_agg(json_build_object('name', t.name))
            FROM "Tags" t
            WHERE t.id IN (
            SELECT tb."TagId"
            FROM tag_book tb
            WHERE tb."BookIdBook" = b.id_book
            )
          ) AS "Tags"
        FROM "Books" b
        JOIN author_book ab ON b.id_book = ab."BookIdBook"
        JOIN "Authors" a ON ab."AuthorId" = a.id
        JOIN "Publishers" p ON b."PublisherId" = p.id
        JOIN "Languages" l ON b."LanguageId" = l.id
        JOIN tag_book tb ON b.id_book = tb."BookIdBook"
        JOIN "Tags" t ON tb."TagId" = t.id
        LEFT JOIN "Reviews" r ON b.id_book = r."BookId"
        GROUP BY b.id_book, p.name, l.language;
      `,
      {
        raw: true,
        type:QueryTypes.SELECT
      })
      return res.send(allBooksDB);
    }

    const targetBooks = await conn.query(`
        SELECT
        b.id_book,
        b.isbn,
        b.title,
        b.published_date,
        b.price,
        b.description,
        AVG(r.rating) AS rating_ave,
        b.image,
        b.page_count,
        b.url,
        (
          SELECT jsonb_agg(json_build_object('name', a.name))
          FROM "Authors" a
          WHERE a.id IN (
          SELECT ab."AuthorId"
          FROM author_book ab
          WHERE ab."BookIdBook" = b.id_book
          )
        ) AS "Authors",
        json_build_object('name', p.name) AS "Publisher", 
        json_build_object('language', l.language) AS "Language", 
        (
          SELECT jsonb_agg(json_build_object('name', t.name))
          FROM "Tags" t
          WHERE t.id IN (
          SELECT tb."TagId"
          FROM tag_book tb
          WHERE tb."BookIdBook" = b.id_book
          )
        ) AS "Tags"
        FROM "Books" b
        JOIN author_book ab ON b.id_book = ab."BookIdBook"
        JOIN "Authors" a ON ab."AuthorId" = a.id
        JOIN "Publishers" p ON b."PublisherId" = p.id
        JOIN "Languages" l ON b."LanguageId" = l.id
        JOIN tag_book tb ON b.id_book = tb."BookIdBook"
        JOIN "Tags" t ON tb."TagId" = t.id
        LEFT JOIN "Reviews" r ON b.id_book = r."BookId"
        WHERE (b.title ILIKE '%${target}%' OR a.name ILIKE '%${target}%' OR p.name ILIKE '%${target}%')
        GROUP BY b.id_book, p.name, l.language;
      `,
      {
        raw: true,
        type:QueryTypes.SELECT
      });

    if (targetBooks.length === 0)
      return res.status(404).json({ error: "Not Found" });
    res.send(targetBooks);
  } catch (error) {
    next(error);
  }
};

module.exports = allBooks;
