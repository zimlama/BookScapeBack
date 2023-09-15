const {conn, Order}=require("../db")

const createOrder = async (pay,id,books)=>{

    try{
        
        const shoppingCart = await conn.query(`
            SELECT s."cart_id"
            FROM "ShoppingCarts" s
            WHERE s."UserId"::"varchar" LIKE '%${pay.UserId}%'
            `)
            
            console.log("User Id: ",id );
            console.log("pay: ",pay);
            console.log("books", books)
    
            const booksId = Array.isArray(books) ? books : [books];
            
            const order = await Order.create({
                pay_id:pay.id_pay,
            order_date: pay.order_date,
            userId:String(pay.UserId),
            shoppingCartId: shoppingCart.cart_id,
            selecBooks:[booksId]
        })
        console.log("booksId: ",booksId);

        console.log("SoppingCart: ",shoppingCart);

        console.log("orden: ", order);
        
        return order
    }catch(error){
        console.log("Error en create order: ", error.message);
    }

}

module.exports=createOrder