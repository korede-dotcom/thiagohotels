const { Sequelize, DataTypes } = require('sequelize');
const connectDb = require("../config/connectDB");
const sequelize = connectDb;

const Branch = sequelize.define('branch', {
  _id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    foreignKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    foreignKey: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull:true,
  },
  state:{
    type: DataTypes.TEXT,
    allowNull:true,
  },
  status:{
    type: DataTypes.BOOLEAN,
    defaultValue:false
  }
});



Branch.sync();

module.exports = Branch;
