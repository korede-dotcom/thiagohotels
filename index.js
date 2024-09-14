'use strict';

const express = require('express');
const app = express();
const routes = require('./routes/Index');
const connectDB = require('./config/connectDB');
const cors = require('cors');
const path = require('path');
const { errorHandler } = require('./middleware/Error');
const cookieParser = require('cookie-parser');
const PaymentMode = require('./models/PaymentMode');
const RoomNumber = require('./models/RoomNumbers');
const HotelBooking = require('./models/HotelBooking');
const cron = require('node-cron');
const { Sequelize,Op } = require('sequelize');
const nodemailer = require('nodemailer');
const SendEmail = require('./utils/sendEmail');


require('dotenv').config();

app.use(cors());

(async () => {
  await connectDB.authenticate().then(async () => {
    console.log('DB Connected...');

    // Seed payment modes if necessary
    const paymentModes = [
      { mode: 'customer-self-payment', status: true },
      { mode: 'Generate-Bank-Transfer', status: true },
      { mode: 'Cash', status: true }
    ];
    // 0 12 * * *

    cron.schedule('* 12 * * *', async () => {
      try {
        const now = new Date();        
        const { Op } = require('sequelize');
        const today = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
        
        const bookings = await HotelBooking.findAll({
          where: {
            // checked_out: false,
            status: 'success',
            end: {
              [Op.gte]: today + 'T00:00:00.000Z',
              [Op.lt]: today + 'T23:59:59.999Z'
            }
          }
        });
        // console.log("🚀 ~ cron.schedule ~ bookings:", bookings)
        
        
        
        // Filter out bookings where end time is today but not yet expired
        const expiredBookings = bookings.filter(booking => {
          const endTime = new Date(booking.end);
          return endTime < now; // Ensure end time is strictly less than current time
        });
        
        console.log("Expired bookings found:", expiredBookings);
        
        if (expiredBookings.length > 0) {
          const roomNumbers = expiredBookings.map(booking => booking.room_number);
          console.log("🚀 ~ cron.schedule ~ roomNumbers:", roomNumbers)

          if (roomNumbers.length > 0) {
              // Update the status of all rooms in the RoomNumber table to false
             const updateRoom = await RoomNumber.update({ status: false }, {
                  where: {
                      room_number: {
                          [Sequelize.Op.in]: roomNumbers,
                      },
                  },
              });
             console.log("🚀 ~ cron.schedule ~ updateRoom:", updateRoom)
        } else {
          console.log("No rooms to update.");
        }
      }
        
      } catch (error) {
        console.error('Error updating room status:', error);
      }
    });

    const findAllPaymentModes = await PaymentMode.findAll();
    if (findAllPaymentModes.length === paymentModes.length) {
      console.log('Payment modes already seeded.');
    } else {
      const seedPaymentMode = await PaymentMode.bulkCreate(paymentModes);
      console.log('Payment modes seeded successfully:', seedPaymentMode);
    }

  }).catch(err => {
    console.log(err);
  });
})();

app.set('view engine', 'ejs');

// Middleware to serve static files (like CSS, JS, images)
app.use(express.static(path.join(__dirname, 'views')));
app.use((req, res, next) => {
  if (req.path.startsWith('/portal')) {
    app.use(express.static(path.join(__dirname, 'views/portal')));
    app.set('views', path.join(__dirname, 'views', 'portal'));
  } else {
    app.set('views', path.join(__dirname, 'views'));
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// Create a transporter object using the default SMTP transport


// Your routes here
app.use(routes);

// Error handling middleware
app.use(errorHandler);


// Cron job for checking and updating room status


const port = process.env.Port || 9800;

app.listen(port, () => console.log(`Server running on ${port}`));
