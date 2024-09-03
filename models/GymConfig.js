const { Sequelize, DataTypes } = require('sequelize');
const connectDb = require("../config/connectDB");
const sequelize = connectDb;

const GymConfig = sequelize.define('gymconfig', {
  _id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    foreignKey: true,
    autoIncrement: true,
  },
  exercise_type: {
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
  has_class:{
    type:DataTypes.BOOLEAN,
    defaultValue:false
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



GymConfig.sync();

module.exports = GymConfig;
