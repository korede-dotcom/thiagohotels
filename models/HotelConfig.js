const { Sequelize, DataTypes } = require('sequelize');
const connectDb = require("../config/connectDB");
const sequelize = connectDb;

const HotelConfig = sequelize.define('hotelconfig', {
  _id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    foreignKey: true,
    autoIncrement: true,
  },
  room_type: {
    type: DataTypes.STRING,
    allowNull: false,
    foreignKey: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
  number_of_guests:{
    type:DataTypes.INTEGER,
    defaultValue:0,
    primaryKey: true,
  },
  price:{
    type:DataTypes.DECIMAL,
    allowNull:false
  },
  branch:{
    type: Sequelize.INTEGER,
    primaryKey: true,
    foreignKey: true,
  },
  service_id:{
    type: Sequelize.INTEGER,
    primaryKey: true,
    foreignKey: true,
  },
  status:{
    type:DataTypes.BOOLEAN,
    defaultValue:false
  }


 
});



HotelConfig.sync();

module.exports = HotelConfig;
