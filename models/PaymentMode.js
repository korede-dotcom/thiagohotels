const { Sequelize, DataTypes } = require('sequelize');
const connectDb = require("../config/connectDB");
const sequelize = connectDb;

const PaymentMode = sequelize.define('paymentmode', {
  _id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    foreignKey: true,
    autoIncrement: true,
  },
  mode:{
    type: Sequelize.STRING,
    allowNull: false,
    unique:true,
  },
  status:{
    type:DataTypes.BOOLEAN,
    defaultValue:true
  }
});



PaymentMode.sync({alter:true});

module.exports = PaymentMode;
