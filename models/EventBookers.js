const { Sequelize, DataTypes } = require('sequelize');
const connectDb = require("../config/connectDB");
const sequelize = connectDb;
const { v4: uuidv4 } = require('uuid');

const EventBooking = sequelize.define('eventbooking', {
  _id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reference_id:{
    type: DataTypes.STRING,
   allowNull:false,
   defaultValue:`SMBE${uuidv4().toString().substring(0,6)}`
  },
  event_type:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  payment_mode:{
    type:DataTypes.ENUM("card","cash","free","cheque","transfer","scanbank"),
    defaultValue:"card"
  },
  amount:{
    type: DataTypes.INTEGER,
    allowNull: false,

  },
  date:{
    type:DataTypes.DATEONLY,
    allowNull:false
  },
  branch_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    foreignKey: true,
  },
  booked_by:{
    type: Sequelize.UUID,
   
  }
}, {
  hooks: {
    beforeCreate: (eventBooking) => {
      console.log("🚀 ~ file: EventBookers.js:58 ~ eventBooking:", eventBooking)
      if (!eventBooking.reference_id || !eventBooking.reference_id.length) {
        eventBooking.reference_id = `SMBE${uuidv4().toString().substring(0,6)}`;
      }
    },
  },
});

EventBooking.sync({alter:true});

module.exports = EventBooking;

