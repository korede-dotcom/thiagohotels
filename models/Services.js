const { Sequelize, DataTypes } = require('sequelize');
const connectDb = require("../config/connectDB");
const sequelize = connectDb;

const Services = sequelize.define('services', {
  _id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    foreignKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.ENUM("gym","shortlet","eventhall"),
    allowNull: false,
    foreignKey: true,
    unique:true
  },
  status:{
    type: DataTypes.BOOLEAN,
    defaultValue:false
  }
 
});



Services.sync();

module.exports = Services;
