const { Sequelize, DataTypes } = require('sequelize');
const connectDb = require("../config/connectDB");
const sequelize = connectDb;

const Room = sequelize.define('roomcategory', {
  _id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    foreignKey: true,
    autoIncrement: true,
  },
  category_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  room_type:{
    type: Sequelize.STRING,
    allowNull: false,
  },
  food: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DECIMAL(10, 2), // 10 digits before the decimal point, 2 digits after
    allowNull: false,
  },
  cancellations_fee:{
    type: Sequelize.STRING,
    defaultValue: '',
  },
  num_beds: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  number_of_guests: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  has_ac: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue:false
  },
  has_wifi: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue:false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  service_id:{
    type: Sequelize.INTEGER,
    primaryKey: true,
    foreignKey: true,
    defaultValue:1,
  },
  branch_id:{
    type: Sequelize.INTEGER,
    foreignKey: true,
    defaultValue:1,
  },
  picture:{
    type:DataTypes.ARRAY(DataTypes.STRING),
    allowNull:true
  },
  status:{
    type:DataTypes.BOOLEAN,
    defaultValue:false
  }


 
});



Room.sync({alter:true});

module.exports = Room;
