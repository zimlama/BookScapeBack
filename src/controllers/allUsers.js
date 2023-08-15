const {User} = require ("../db")  

const allUsers = async () => {
    return await User.findAll()
}

module.exports= allUsers