'use strict';

const connectDb = require('../config/connectDB');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = connectDb; // Using your connectDb connection

const RoomNumber = require('../models/RoomNumbers'); // Ensure correct path
const Booking = require('../models/HotelBooking'); // Ensure correct path

// Define the cron job function
async function checkAndUpdateRoomStatus() {
    try {
        const now = new Date();

        // Find all bookings where 'end' is less than the current date and time
        const expiredBookings = await Booking.findAll({
            where: {
                end: {
                    [Sequelize.Op.lt]: now,
                },
                status: 'success', // Only consider rooms that are currently booked
            },
        });

        // Extract room numbers from the expired bookings
        const roomNumbers = expiredBookings.map(booking => booking.room_number);

        if (roomNumbers.length > 0) {
            // Update the status of all rooms in the RoomNumber table to false
            await RoomNumber.update({ status: false }, {
                where: {
                    room_number: {
                        [Sequelize.Op.in]: roomNumbers,
                    },
                },
            });
            console.log(`Updated status for rooms: ${roomNumbers.join(', ')}`);
        } else {
            console.log('No rooms to update.');
        }
    } catch (error) {
        console.error('Error updating room status:', error);
    } finally {
        // Close the Sequelize connection
        // sequelize.close();
    }
}

// Log a message to verify connection
sequelize.authenticate()
    .then(() => {
        console.log('Connected to the database.');
        // Execute the function
        checkAndUpdateRoomStatus();
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
