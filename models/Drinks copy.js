const { Sequelize, DataTypes } = require('sequelize');
const connectDb = require("../config/connectDB");
const Drink = require('./Drinks');
const sequelize = connectDb;

const DrinkLog = sequelize.define('DrinkLog', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  drink_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stockAfterTransaction: {
    type: DataTypes.INTEGER, // To record the stock after the action
    allowNull: false
  },
  staff_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
});



DrinkLog.sync({alter:true});

module.exports = DrinkLog;
