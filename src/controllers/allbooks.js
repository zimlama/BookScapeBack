const {Book, Language, Author} = require("../db")



//titulo imagen rating author precio CARD
const allBooks = async (req, res, next) => {
    try {
        
        const allBooksDB = await Book.findAll({
            attributes: ['title','price','rating_ave','image'],
            include: {
                model: Author,
                attributes: ["name"],
                through: {
                  attributes: [],
                },
              },
        })
        res.send(allBooksDB)
    } catch (error) {
        next(error)
    }
}

module.exports= allBooks
