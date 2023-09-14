const {conn,Pay,User,Order} = require("../db")

const setPay = async(req,res,next)=>{
    try{
        const {orden,id,selectBook} = req.body

        if(!orden||!id) return res.status(400).json({message: "Faltan datos para registrar el pago"})
        
        console.log("Body: ", req.body);

        console.log("UserId: ",id);
        
        const user = await User.findByPk(id)

        if(!user) return res.status(400).json({message:"Usuario inexistente"})

        console.log("registered Pay: ", {
            id_pay: orden.id,
            order_date: orden.create_time,
            total_order: Number(orden.purchase_units[0].amount.value),
            payment_status: orden.status,
            date_approved: orden.update_time,
            UserId: id,
            SelectBook: selectBook
            }
        );
        const shoppingCart = await conn.query(`
        SELECT s."cart_id"
        FROM "ShoppingCarts" s
        WHERE s."UserId"::"varchar" LIKE '%${id}%'
        `)
        console.log("SoppingCart: ",shoppingCart);
        


                const setPay = await Pay.create(
                    {
                    id_pay: orden.id,
                    order_date: orden.create_time,
                    total_order: Number(orden.purchase_units[0].amount.value),
                    payment_status: orden.status,
                    date_approved: orden.update_time,
                    UserId: id
                    }   
                )
        
                 console.log("new pay:",setPay );   
                                      
                const newOrder = await Order.create({
                        pay_id:setPay.id_pay,
                        order_date: setPay.order_date,
                        userId:setPay.UserId,
                        shoppingCartId: shoppingCart.cart_id,
                        selecBooks:selectBook
                })

                await newOrder.update({selecBooks:selectBook,
                                 shoppingCartId: shoppingCart.cart_id,
                                 userId:id
                                })
                      
                console.log("New Order: ",newOrder);
        
        res.status(200).json({message:"Pay registered successfully",
                                registeredPay: setPay,
                                selectBook:selectBook,
                                shoppingCart:shoppingCart.cart_id,
                                UserId:id})

        // Promise.all([
        //     conn.query(`
        //         SELECT s."cart_id"
        //         FROM "ShoppingCarts" s
        //         WHERE s."UserId"::"varchar" LIKE '%${id}%'
        //     `),
        //     Pay.create({
        //         id_pay: orden.id,
        //         order_date: orden.create_time,
        //         total_order: Number(orden.purchase_units[0].amount.value),
        //         payment_status: orden.status,
        //         date_approved: orden.update_time,
        //         UserId: id
        //     })
        // ]).then(([shoppingCart, setPay]) => {
        //     console.log("SoppingCart: ", shoppingCart);
        //     console.log("new pay:", setPay);
        //     return Order.create({
        //         pay_id: setPay.id_pay,
        //         order_date: setPay.order_date,
        //         userId: setPay.UserId,
        //         shoppingCartId: shoppingCart.cart_id,
        //         selecBooks: selectBook
        //     });
        // }).then(newOrder => {
        //     console.log("New Order: ", newOrder);
        //     res.status(200).json({message:"Pay registered successfully"})
        // }).catch(error => {
        //     console.log("Error en promisseall");
        // });


    }catch(error){
        console.log("Error en setPay: ",error.message);
        next(error)
    }
    
}

module.exports=setPay