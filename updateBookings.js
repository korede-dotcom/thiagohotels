const { Sequelize, Op } = require('sequelize');
const HotelBooking = require('./models/HotelBooking');
const RoomNumber = require('./models/RoomNumbers');


async function updateRoomStatus() {
  try {
    const now = new Date();        
    const today = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

    const bookings = await HotelBooking.findAll({
      where: {
        status: 'success',
        end: {
          [Op.gte]: today + 'T00:00:00.000Z',
          [Op.lt]: today + 'T23:59:59.999Z'
        }
      }
    });

    // Filter out bookings where end time is today but not yet expired
    const expiredBookings = bookings.filter(booking => {
      const endTime = new Date(booking.end);
      return endTime < now; // Ensure end time is strictly less than current time
    });

    console.log("Expired bookings found:", expiredBookings);

    if (expiredBookings.length > 0) {
      const roomNumbers = expiredBookings.map(booking => booking.room_number);

      if (roomNumbers.length > 0) {
        // Update the status of all rooms in the RoomNumber table to false
        const updateRoom = await RoomNumber.update({ status: false }, {
          where: {
            room_number: {
              [Op.in]: roomNumbers,
            },
          },
        });
        console.log("Rooms updated:", updateRoom);
      } else {
        console.log("No rooms to update.");
      }
    }
  } catch (error) {
    console.error('Error updating room status:', error.stack);
  }
}

// Run the function
updateRoomStatus();
