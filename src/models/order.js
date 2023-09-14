const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Order",
    {
      order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      pay_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // total_order: {
      //   type: DataTypes.DECIMAL(10, 2),
      //   allowNull: false,
      // },
      order_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // purchase_status: {
      //   type: DataTypes.ENUM("Pending", "Completed"),
      //   allowNull: false,
      //   defaultValue: "Pending",
      // },
      // active: {
      //   type: DataTypes.BOOLEAN,
      //   allowNull: false,
      //   defaultValue: true,
      // },
      selectBooks: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
      }
    },
    {paranoid: true }
  );
};
