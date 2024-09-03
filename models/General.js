const { Sequelize, DataTypes } = require('sequelize');
const connectDb = require("../config/connectDB");
const sequelize = connectDb;

const General = sequelize.define('General', {
  _id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    foreignKey: true,
    autoIncrement: true,
  },
  general_message:{
    type:DataTypes.TEXT,
  },
  status:{
    type:DataTypes.BOOLEAN,
    defaultValue:false
  }


 
});



General.sync();

module.exports = General;
