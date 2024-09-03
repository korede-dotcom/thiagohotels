const { Sequelize, DataTypes } = require('sequelize');
const connectDb = require("../config/connectDB");
const sequelize = connectDb;

const RoomNumber = sequelize.define('roomnumber', {
  _id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    foreignKey: true,
    autoIncrement: true,
  },
  category_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  room_name:{
    type: Sequelize.STRING,
    allowNull: false,
    unique:true,
  },
  room_number: {
    type: Sequelize.STRING,
    allowNull: false,
    unique:true,
  },
  status:{
    type:DataTypes.BOOLEAN,
    defaultValue:true
  }


 
});



RoomNumber.sync({alter:true});

module.exports = RoomNumber;
