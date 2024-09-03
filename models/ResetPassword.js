const { Sequelize, DataTypes } = require('sequelize');
const connectDb = require("../config/connectDB");
const sequelize = connectDb;

const ResetPassword = sequelize.define('resetpassword', {
  _id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: Sequelize.UUID,
    allowNull: false
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false
  },
  expiresAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('NOW() + INTERVAL \'5 MINUTE\'')

  }
});

ResetPassword.sync()
module.exports = ResetPassword;
