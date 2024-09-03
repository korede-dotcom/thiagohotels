const { Sequelize, DataTypes } = require('sequelize');
const connectDb = require("../config/connectDB");
const sequelize = connectDb;

const HotelBooking = sequelize.define('hotelbooking', {
   
    start: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end: {
        type: DataTypes.DATE,
        allowNull: false
    },
    room_name: {
        type: DataTypes.STRING, 
    },
    room_number: {
        type: DataTypes.STRING, 
    },
    amount:{
        type:DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0
    },
    night: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:1
    },
    guest_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    guest_email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    guest_phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category_id: {
        type: Sequelize.INTEGER,
        foreignKey: true
    },
    category_name: {
        type: DataTypes.STRING,
        
    },
    room_id: {
        type: Sequelize.INTEGER,
        foreignKey: true
    },
    branch_id: {
        type: Sequelize.INTEGER,
        defaultValue:1,
        foreignKey: true
    },
    guest_address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    guest_count: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    booked_from:{
        type: DataTypes.ENUM("web-online", "reception"),
        defaultValue:"web-online",
    },
    checked_in:{
        type: DataTypes.BOOLEAN,
        defaultValue:false,
    },
    checked_out:{
        type: DataTypes.BOOLEAN,
        defaultValue:false,
    },
    checked_in_by:{
        type: DataTypes.STRING,
        defaultValue:"not checked",
    },
    booked_by:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "self"
    },
    payment_mode: {
        type: DataTypes.ENUM("card", "cash", "free", "cheque", "transfer", "scanbank"),
        defaultValue:"card",
    },
    status: {
        type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed","success", "initiated"),
        defaultValue:"initiated",
    },
    reference_id: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    hooks: {
        beforeSave: (booking) => {
            if (booking.end) {
             let endDate = new Date(booking.end);

                // Set time to 12:00 PM (noon)
                endDate.setHours(12, 0, 0, 0);

                // Calculate timezone offset in minutes (for example, +01:00 is 60 minutes)
                const timezoneOffsetInMinutes = 60; // Adjust as needed for your timezone
                const timezoneOffsetInMs = timezoneOffsetInMinutes * 60 * 1000; // Convert offset to milliseconds// Adjust the date for the timezone offset
                endDate = new Date(endDate.getTime() + timezoneOffsetInMs);

                // Format the date to "YYYY-MM-DD HH:MM:SS±TZD" with timezone offset
                const formattedDate = endDate.toISOString().replace('T', ' ').slice(0, 19) + '+01:00';

                // Set the formatted date back to the booking object
                booking.end = formattedDate;
            }
        }
    }
});

HotelBooking.sync({ alter: true });

module.exports = HotelBooking;
