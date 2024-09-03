const { Sequelize, DataTypes } = require('sequelize');
const connectDb = require("../config/connectDB");
const sequelize = connectDb;


const TodoList = sequelize.define('todolist', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    created_by:{
        type: DataTypes.UUID,
        foreignKey: true,
        allowNull: false
    },
    assigned_to: {
      type: DataTypes.UUID,
      foreignKey: true,
      allowNull: false
    },
    dueDate: {
      type: Sequelize.DATE,
      allowNull: true
    },
    completed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  });

  TodoList.sync()
  
  module.exports = TodoList;