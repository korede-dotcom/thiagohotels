const { Sequelize, DataTypes } = require('sequelize');
const connectDb = require("../config/connectDB");
const sequelize = connectDb;

const Event = sequelize.define('event', {
  _id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  event_type:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  first_name:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  address:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_number:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull:true
  },
  branch:{
    type: DataTypes.INTEGER,
    foreignKey: true,
  },
  service_id:{
    type: DataTypes.INTEGER,
    foreignKey: true,
  },
  number_of_guests:{
    type:DataTypes.TEXT,
    defaultValue:"no idea"
  },
  event_date:{
    type: DataTypes.DATE,
    allowNull:false
  },
  start_time: {
    type: DataTypes.DATE,
  },
  end_time: {
    type: DataTypes.DATE,
  },
  payment_mode:{
   type: DataTypes.ENUM("cheque","card","cash","transfer","free"),
   allowNull:false
  },
  payment_channel:{
   type: DataTypes.STRING,
   allowNull:false
  },
  payment_reference:{
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  amount:{
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  status:{
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },
  is_done:{
    type: DataTypes.BOOLEAN,
    defaultValue:false
  }
 
},{
    hooks:{
        beforeCreate: async (event, options) => {
            let referenceId = "SM" + Date.now().toString();
            event.reference_id = referenceId;
        },
    },
});

Event.sync();

module.exports = Event;
