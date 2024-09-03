const routes = require("express").Router();
const axios = require("axios");
const Room = require("../models/Room");
const expressAsyncHandler = require("express-async-handler");
const HotelBooking = require("../models/HotelBooking");
const moment = require('moment');
const RoomNumber = require("../models/RoomNumbers");
// const todoControl = require("../controllers/Todo")
// const allowedUser = require("../middleware/Authorization")
// const {todoListValidationRules} = require("../middleware/validator")
// const {protect} = require("../repos/token-repo")

// routes.get("/",)
// routes.post("/",protect,allowedUser([1,5]),todoListValidationRules,todoControl.create)


const PAYSTACK_BASE_URL = process.env.PAYSTACK_BASE_URL;
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY; // Get your API key from environment variables

// Route to initiate a payment


routes.post('/paystack/initialize/reception', expressAsyncHandler( async (req, res) => {
  const { category_id, start, end, mode } = req.body;
  console.log(req.body);
  
  function parseDate(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed in Date
  }
  
  // Example usage:
  const parsedStartDate = parseDate(start);
  const parsedEndDate = parseDate(end);
  
  console.log('Parsed Start Date:', parsedStartDate);
  console.log('Parsed End Date:', parsedEndDate);

    const findCategory = await Room.findOne({where: {_id: category_id }})
    if (!findCategory) {
       res.status(400).json({message: 'Invalid category ID provided to initialize payment request ' + category_id,status:false});
    }
   
    
    // Convert the start and end strings to Date objects
    const startDate = parseDate(start);
    const endDate = parseDate(end);
    
    // Calculate the difference in time (milliseconds)
    const timeDifference = endDate - startDate;
    
    // Convert the time difference from milliseconds to days
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    console.log("🚀 ~ routes.post ~ daysDifference:", daysDifference)

    // Calculate the total cost
    const totalCost = daysDifference * findCategory.price;
    console.log("🚀 ~ routes.post ~ totalCost:", totalCost)

    // Create a reference for the transaction

      const response = await axios.post(
        `${process.env.paystackUrl}/transaction/initialize`,
        {
          email:req.body.guest_email,
          amount: totalCost * 100 , // Convert to kobocallback_url: "http://localhost:3200/paystack/webhook",
          metadata: {
            // products: JSON.stringify(totals),
            products: {
              details:{...req.body,start:start,end:end,guest_count:findCategory.number_of_guests,
              night:daysDifference,
              // amount:totalCost,
              amount:totalCost * 100,
              booked_from:'reception',
              booked_by:req.body.guest_name,    
              }
            },
            
          }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.paystackSecretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("🚀 ~ routes.post ~ response:", response.data.data)
      if(!response.data.data.authorization_url){
        return res.status(400).json({message: 'Failed to initialize payment',status:false});
      }
      const sortNumber = '0' + req.body.guest_phone.toString().substring(1);
    const formattedNumber = '234' + sortNumber;
    console.log(formattedNumber);
    const msg = `Your booking has been initiated please make payments here link:${response.data.data.authorization_url}`;
      const sendSms = await axios.get(`${process.env.smsUrl}?user=${process.env.smsusername}&pass=${process.env.smspassword}&to=${formattedNumber}&from=${process.env.smsFrom}&msg=${msg}`)
  
      console.log("🚀 ~ routes.post ~ sendSms:", sendSms)
      res.status(200).json({
        status: true,
        message: 'Payment initialized successfully',
        data: response.data.data,
      });

      // Save the transaction reference to your database
    const saveData =  await HotelBooking.create({
        ...req.body,start:start,end:end,guest_count:findCategory.number_of_guests,
              night:daysDifference,
              amount:totalCost * 100,
              reference_id:response.data.data.reference,
              booked_from:'reception',
              booked_by:req.body.guest_name,    
      });
    console.log("🚀 ~ routes.post ~ saveData:", saveData)
   return;
    
  }));
routes.post('/paystack/initialize', expressAsyncHandler( async (req, res) => {
    const { category_id,start,end } = req.body;
    console.log(req.body)

    function parseDate(dateStr) {
      const [day, month, year] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day); // month is 0-indexed in Date
    }

    function dateConverter(date) {
    const inputDate = date;

// Parse the date string using moment with the specific format
const momentDate = moment(inputDate, 'DD-MM-YYYY');

// Manually set the time to 01:00:00 and format to 'YYYY-MM-DD HH:mm:ssZ'
const formattedDate = momentDate.set({hour: 1, minute: 0, second: 0}).format('YYYY-MM-DD HH:mm:ss+01:00');
      return formattedDate
    }

    const findCategory = await Room.findOne({where: {_id: category_id }})
    if (!findCategory) {
       res.status(400).json({message: 'Invalid category ID provided to initialize payment request ' + category_id,status:false});
    }
   
    
    // Convert the start and end strings to Date objects
    const startDate = parseDate(start);
    const endDate = parseDate(end);
    
    // Calculate the difference in time (milliseconds)
    const timeDifference = endDate - startDate;
    
    // Convert the time difference from milliseconds to days
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    console.log("🚀 ~ routes.post ~ daysDifference:", daysDifference)

    // Calculate the total cost
    const totalCost = daysDifference * findCategory.price;
    console.log("🚀 ~ routes.post ~ totalCost:", totalCost)

    // Create a reference for the transaction

      const response = await axios.post(
        `${process.env.paystackUrl}/transaction/initialize`,
        {
          email:req.body.guest_email,
          amount: totalCost * 100 , // Convert to kobocallback_url: "http://localhost:3200/paystack/webhook",
          metadata: {
            // products: JSON.stringify(totals),
            products: {
              details:{...req.body,start:dateConverter(start),end:dateConverter(end),guest_count:findCategory.number_of_guests,
              night:daysDifference,
              // amount:totalCost,
              amount:totalCost * 100,
              booked_from:'web-online',
              booked_by:req.body.guest_name,    
              }
            },
            
          }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.paystackSecretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("🚀 ~ routes.post ~ response:", response.data.data)
      if(!response.data.data.authorization_url){
        return res.status(400).json({message: 'Failed to initialize payment',status:false});
      }
  
      res.status(200).json({
        status: true,
        message: 'Payment initialized successfully',
        data: response.data.data,
      });

      // Save the transaction reference to your database
    const saveData =  await HotelBooking.create({
        ...req.body,start:dateConverter(start),end:dateConverter(end),guest_count:findCategory.number_of_guests,
              night:daysDifference,
              amount:totalCost * 100,
              reference_id:response.data.data.reference
      });
    console.log("🚀 ~ routes.post ~ saveData:", saveData)
   return;
    
  }));
  
  
  
  routes.get('/paystack/verify/:reference', async (req, res) => {
    const { reference } = req.params;
  
    try {
      const response = await axios.get(
        `${process.env.paystackUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.paystackSecretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      res.status(200).json({
        status: true,
        message: 'Payment verification successful',
        data: response.data.data,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Payment verification failed',
        error: error.response ? error.response.data : error.message,
      });
    }
  });
  
  
  
  routes.post('/paystack/webhook', async (req, res) => {
    const paystackSignature = req.headers['x-paystack-signature'];
    const secret = process.env.paystackSecretKey;
  
    // Verify webhook signature
    if (!paystackSignature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }
  
    // Validate the signature
    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');
  
    if (hash !== paystackSignature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }
  
    // Handle the event
    const event = req.body;
    console.log('Event received:', event.data.metadata);
  
    const response = await axios.get(`${process.env.paystackUrl}/transaction/verify/${event.data.reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log("🚀 ~ response:", response)
    console.log("🚀 ~ routes.post ~ saveBookings:", event.data.metadata.products)
    let status = response.data.data.status === 'success' ? 'success' : 'failed';
    res.locals.trnx = {
      ...event.data.metadata.products.details,reference_id:event.data.reference,status:status
    }
    const saveBookings = await HotelBooking.update(
      { status: status }, 
      { where: { reference_id: event.data.reference } }
    );

    
    // res.redirect("/result",{booking: saveBookings});  
    console.log("🚀 ~ routes.post ~ saveBookings:", saveBookings)
  
    // const mappedProduct = event.data.metadata.products.productDescriptions.forEach( async (element) => {
    //     await Order.create({
    //       reference: event.data.reference,
    //       status: response.data.data.status,
    //       amount: element.product_total, // Convert to cents
    //       quantity: element.quantity,
    //       productName: element.name, //
    //       customerName: element.customer_name,
    //       userId: event.data.metadata.userId || "21136955-6f72-474f-bd57-f7fb3b753173",
    //     })
  
    // });
  
    // await Delivery.create({
    //   orderId: response.data.data.id,
    //   status: "pending",
    //   ...event.data.metadata.products.deliveryDetails
    // })
    const startDate = new Date(event.data.metadata.products.details.start);
    const currentDate = new Date();
    
    // Reset time components of the dates for accurate comparison.
    startDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    
    // Check if start date is the current date
    if (startDate.getTime() === currentDate.getTime()) {
        // Update room status only if start date is the current date
        let roomStatus = response.data.data.status === 'success' ? true : false;
        const isUpdated = await RoomNumber.update(
            { status: roomStatus },
            { where: { room_number: event.data.metadata.products.details.room_number } }
        );
    }
    return res.status(200).json({ message: 'Webhook received' });
  });



  routes.get("/result", async (req, res) => {
    try {
      console.log("Query parameters:", req.query);
  
      const referenceId = req.query.reference?.toString().trim();
  
      if (!referenceId) {
        return res.status(400).json({
          status: false,
          title: "Bad Request",
          message: "Reference ID is missing",
        });
      }
  
      const findBookings = await HotelBooking.findOne({
        where: { reference_id: referenceId },
      });
  
      if (!findBookings) {
        return res.status(404).json({
          status: false,
          title: "Not Found",
          message: "Booking not found",
        });
      }
  
      console.log("Booking object:", findBookings);
  
      res.render("success", { booking: findBookings });
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({
        status: false,
        title: "Server Error",
        message: "An error occurred while processing your request",
      });
    }
  });
  

module.exports = routes;