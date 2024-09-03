const { Sequelize, DataTypes } = require('sequelize');
const connectDb = require("../config/connectDB");
const sequelize = connectDb;

const Manager = sequelize.define('manager', {
  _id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    foreignKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    foreignKey: true,
    unique:true
  },
  phonenumber:{
    type: DataTypes.TEXT,
    allowNull:true,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull:true,
  },
  state:{
    type: DataTypes.TEXT,
    allowNull:true,
  },
  address:{
    type: DataTypes.TEXT,
    allowNull:true,
  },
  branch_id:{
    type: Sequelize.INTEGER,
    foreignKey: true,
  }
 
});



Manager.sync();

module.exports = Manager;
