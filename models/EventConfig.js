const { Sequelize, DataTypes } = require('sequelize');
const connectDb = require("../config/connectDB");
const sequelize = connectDb;

const EventConfig = sequelize.define('eventconfig', {
  _id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    foreignKey: true,
    autoIncrement: true,
  },
  event_type: {
    type: DataTypes.STRING,
    allowNull: false,
    foreignKey: true,
    unique:true,
  },
  description: {
    type: DataTypes.TEXT,
  },
  openning_time:{
    type: DataTypes.TEXT,
  },
  closing_time:{
    type: DataTypes.TEXT,
  },
  number_of_gusets:{
    type:DataTypes.INTEGER,
    defaultValue:0,
    primaryKey: true,
  },
  price:{
    type:DataTypes.DECIMAL,
    allowNull:false
  },
  
  branch_id:{
    type: Sequelize.INTEGER,
    primaryKey: true,
    foreignKey: true,
  },
  service_id:{
    type: Sequelize.INTEGER,
    foreignKey: true,
  },
  status:{
    type:DataTypes.BOOLEAN,
    defaultValue:false
  }


 
});



EventConfig.sync();

module.exports = EventConfig;
