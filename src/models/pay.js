const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  /* 
Este modelo debe definirse dacuerdo a los datos de 
la respuesta del medio de pago https://www.mercadopago.com.ar/developers/es/docs/checkout-api/landing
*/

  sequelize.define(
    "Pay",
    {
      id_pay: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      order_date: {
        type: DataTypes.STRING,
      },
      total_order: {
        type: DataTypes.DECIMAL(10, 2),
      },
      payment_status: {
        type: DataTypes.STRING,
      },
      date_approved: {
        type: DataTypes.STRING,
      },
    },
   
  );
};
