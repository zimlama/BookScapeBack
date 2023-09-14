const {conn} = require("../db")
const {QueryTypes} = require("sequelize")

//Los filtros conbinados llegan por query: se puede filtrar por:
//  *autor (author) - se pueden incluir mas de un valor separado por comas (,)
//  *publisher(publisher)
//  *precio(price) menores o ifguales al precio consignado
//  *rating promedio(rating_ave)mayor o igual al rating consignado
//  *tags(tags)  se pueden incluir mas de un valor separado por comas (,)
//Los filtros se pueden combinar de culquier forma y solo se incluyen los campos 
//por los cuales se quiere filtrar
//por ejemplo :
//http://localhost:3001/books/filter?language=en&price=10&publisher=Bloomsbury%20Publishing%20USA&tags=History,Fiction

const filrterBooks = async (req,res,next) =>{
    try{
        const{authors,language,publisher,price,rating_ave,tags}=req.query

        const arrayAuthors = authors ? (authors.split(",").map(author=>author.replace("+"," "))): null;
        
        const arrayTags = tags ? (tags.split(",").map(tag=>tag.replace("+"," "))) : null;

        const filteredBooks = await conn.query(`
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
        WHERE
        (:author_names IS NULL OR a.name = ANY(SELECT json_array_elements_text(:author_names::json))) AND
        (:language IS NULL OR l.language = :language) AND
        (:publisher_name IS NULL OR p.name = :publisher_name) AND
        (:max_price IS NULL OR b.price <= :max_price) AND
        (:tag_names IS NULL OR t.name = ANY(SELECT json_array_elements_text(:tag_names::json)))
        GROUP BY b.id_book, p.name, l.language
        HAVING
            (:rating_ave IS NULL OR AVG(r.rating) >= :rating_ave);
        `,
        {
            replacements:{
                author_names: arrayAuthors ? JSON.stringify(arrayAuthors) : null,
                max_price: price ? Number(price) : null,
                publisher_name: publisher || null,
                language: language || null,
                rating_ave: Number(rating_ave) ? Number(rating_ave) : null,
                tag_names: arrayTags ? JSON.stringify(arrayTags) : null,
            },
            raw: true,
            type: QueryTypes.SELECT
        }
        )
        res.send(filteredBooks)
    }catch(error){
        next(error);
    }
}

module.exports=filrterBooks