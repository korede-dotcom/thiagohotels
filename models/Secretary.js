const { Sequelize, DataTypes } = require('sequelize');
const connectDb = require("../config/connectDB");
const sequelize = connectDb;

const Secretary = sequelize.define('secretary', {
  _id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    foreignKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    foreignKey: true,
  },
  image: {
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



Secretary.sync();

module.exports = Secretary;
