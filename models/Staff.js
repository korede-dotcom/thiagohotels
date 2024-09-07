const { Sequelize, DataTypes } = require('sequelize');
const connectDb = require("../config/connectDB");
const sequelize = connectDb;

const Staff = sequelize.define('staff', {
  _id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    foreignKey: true,
    autoIncrement: true,
  },
  user_id:{
    type: Sequelize.UUID,
    allowNull: false,
  },
  phonenumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status:{
    type:DataTypes.BOOLEAN,
    defaultValue:true
  }
});



Staff.sync({alter:true});

module.exports = Staff;
