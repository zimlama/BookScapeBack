const {Book} = require("../db")
const {Op} = require("sequelize")

const filrterBooks = async (title,authors,publisher,language,price,rating_ave,tags) =>{
    return await Book.findAll({
            where:{
                title: {[Op.iLike]: `%${title || ''}%`},
                authors: {[Op.contains]: authors || []},
                publisher:{[Op.iLike]: `%${publisher || ''}%`},
                language: {[Op.iLike]: `%${language || ''}%`},
                price: {[Op.lte]:parseFloat(price) || Infinity },
                rating_ave:{[Op.gte]:parseFloat(rating_ave)||0},
                tags: {[Op.contains]: tags || []},
            },
        })
}

export default filrterBooks