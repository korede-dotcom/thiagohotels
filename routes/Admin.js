const routes = require("express").Router()
const expressAsyncHandler = require("express-async-handler");
const Admin = require("../controllers/Admin");
const { createRoomUnderCat } = require("../controllers/Hotelmanager");
const checkAuthCookie = require("../middleware/checkAuthCookie");
const HotelBooking = require("../models/HotelBooking");
const RoomNumber = require("../models/RoomNumbers");
const RoomRepo = require("../repos/Room-repo");
const { QueryTypes, Sequelize, where } = require('sequelize');
const Room = require("../models/Room");
const PaymentMode = require("../models/PaymentMode");


routes.get("/",async (req,res) => {
            res.render('login', {
              pkgs: "jhgfhghh",
            });
          
      })
routes.get("/dashboard",checkAuthCookie,async (req,res) => {
            res.render('index', {
              name: req.user.name ,
              email: req.user.email ,
              roleName:req.user.roleName
            });
      })
routes.post("/add-room-category",checkAuthCookie,async (req,res) => {
            res.render('index', {
              name: req.user.name ,
              email: req.user.email ,
              roleName:req.user.roleName
            });
      })
routes.get("/add-room-category",checkAuthCookie,async (req,res) => {
        res.render('addroomcategory', {
              name: req.user.name ,
              email: req.user.email ,
              roleName:req.user.roleName
            });
      });
routes.get("/room-category",checkAuthCookie,async (req,res) => {
      if(req.query.type === "delete" && req.query.id) {
            const catego = await RoomRepo.deletecategory(req.query.id)
            console.log("🚀 ~ routes.get ~ catego:", catego)
            const categories = await RoomRepo.roomCategorys()
                return  res.render('roomcategory', {
                    name: req.user.name ,
                    email: req.user.email ,
                    roleName:req.user.roleName,
                    categories:categories
                  });
      
      }
      const categories = await RoomRepo.roomCategorys()
            res.render('roomcategory', {
              name: req.user.name ,
              email: req.user.email ,
              roleName:req.user.roleName,
              categories:categories
            });
      })
routes.get("/add-room",checkAuthCookie,async (req,res) => {
      const categories = await RoomRepo.roomCategorys()
            res.render('add-room', {
              name: req.user.name ,
              email: req.user.email ,
              roleName:req.user.roleName,
              categories:categories
            });
      })
.post("/add-room",checkAuthCookie,createRoomUnderCat)

routes.get("/all-rooms",checkAuthCookie,async (req,res) => {
      const page = parseInt(req.query.page) || 1; // Current page number, default is 1
      const limit = parseInt(req.query.limit) || 10; // Number of items per page, default is 10
      const offset = (page - 1) * limit; // Calculate the offset
      
      const query = `
        SELECT 
    roomnumbers._id AS id, 
    roomnumbers.*, 
    roomcategories._id AS category_id,
    roomcategories.*
FROM 
    roomnumbers
INNER JOIN 
    roomcategories ON roomnumbers.category_id = roomcategories._id
LIMIT 
    :limit 
OFFSET 
    :offset;
`;
        
        
      
      const results = await RoomNumber.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { limit, offset }
      });
      console.log("🚀 ~ routes.get ~ results:", results)
      
      // Count total items for pagination
      const countQuery = `
        SELECT COUNT(*) as totalItems
        FROM roomnumbers
        INNER JOIN roomcategories ON roomnumbers.category_id = roomcategories._id`;
      
      const totalItems = await RoomNumber.sequelize.query(countQuery, { type: QueryTypes.SELECT });
      const totalPages = Math.ceil(totalItems[0].totalItems / limit);
      
      res.render('all-rooms', {
            name: req.user.name ,
            email: req.user.email ,
            roleName:req.user.roleName,
            success: true,
            data: results,
            pagination: {
                  totalItems: totalItems[0].totalItems,
                  totalPages,
                  currentPage: page,
                  pageSize: limit
            }
      
      });
 
      })

routes.get("/all-booking",checkAuthCookie,async (req, res) => {
      const bookings = await HotelBooking.findAll({order: [['id', 'DESC']]})
      
      res.render('all-booking', {
            name: req.user.name ,
            email: req.user.email ,
            roleName:req.user.roleName,
            bookings:bookings,
          })
})
routes.get("/add-booking",checkAuthCookie,async (req, res) => {
      if(req.query.id && req.query.cat_id){
            const bookings = await HotelBooking.findAll({order: [['id', 'DESC']]})
            const categories = await RoomRepo.roomNumber(req.query.id)
            const getModes = await PaymentMode.findAll({where:{status:true}})
            return res.render('add-booking-category', { 
                  name: req.user.name ,
                  email: req.user.email ,
                  roleName:req.user.roleName,
                  categories:categories,
                  category_name:req.query.cat_id,
                  amount:req.query.price,
                  modes:getModes
                  
            })
      }
      const bookings = await HotelBooking.findAll({order: [['id', 'DESC']]})
      const categories = await RoomRepo.roomCategorys()
//      const categories = await 
      res.render('add-booking', {
            name: req.user.name ,
            email: req.user.email ,
            roleName:req.user.roleName,
            categories:categories
          })
})
routes.post("/check-booking",checkAuthCookie,async (req, res) => {
      const bookingkey = await HotelBooking.findOne({where: {reference_id:req.query.key}})
      if (!bookingkey) return res.status(404).json({status: false, message:'key not found or check properly'})
      return res.status(200).json({status: true, message:'key not found or check properly',data:bookingkey})  
})


routes.get("/check-booking",checkAuthCookie,async (req, res) => {
      res.render('check-booking', {
            name: req.user.name ,
            email: req.user.email ,
            roleName:req.user.roleName,
            // bookings:bookings,
          })
})
 

routes.get("/check-in",checkAuthCookie, async (req, res) => {
    const bookings = await HotelBooking.findOne({ where: { reference_id: req.query.key } });
    res.render('check-in', {
      name: req.user.name,
      email: req.user.email,
      roleName: req.user.roleName,
      bookings: bookings,
    });
  })

routes.post("/check-in", checkAuthCookie, expressAsyncHandler( async (req, res) => {
    const  key  = req.query.key;
    const booking = await HotelBooking.update(
      { checked_in: true,checked_in_by:req.user.name },
      { where: { reference_id:key } }
    );
    return res.status(200).json({status: true, message:'Customer as been checked in',bookings:booking}) 
//     if (booking[0] > 0) { // Sequelize update method returns an array, the first element is the number of affected rows
//       return res.status(200).json({status: true, message:'Customer as been checked in',bookings:booking})  
//     } else {
//       return res.status(200).json({status: false, message:'Error while Customer as been checked in',bookings:booking})  
//     }
  }));

  routes.get("/all-customer",checkAuthCookie, async (req, res) => {
      if (req.query.email) {
            const bookings = await HotelBooking.findAll({
                  where: {
                    guest_email: req.query.email
                  },
                  order: [['id', 'DESC']]
                });
                
          return  res.render('one-customer', {
                  name: req.user.name,
                  email: req.user.email,
                  roleName: req.user.roleName,
                  bookings: bookings,
                  customer_email: req.query.email,
                  customer_name: req.query.name,


                });
      }
      const distinctCustomer = await HotelBooking.findAll({
            attributes: [
              'guest_email',
              [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN status = 'success' THEN 1 ELSE 0 END`)), 'success_count'],
              [Sequelize.fn('MIN', Sequelize.col('guest_name')), 'guest_name'], // Choose the first occurrence of guest_name
              [Sequelize.fn('MIN', Sequelize.col('guest_phone')), 'guest_phone'], // Choose the first occurrence of guest_phone
              [Sequelize.fn('MIN', Sequelize.col('guest_address')), 'guest_address'] // Choose the first occurrence of guest_address
              // Or concatenate them if needed
              // [Sequelize.fn('GROUP_CONCAT', Sequelize.col('guest_name')), 'guest_name'],
              // [Sequelize.fn('GROUP_CONCAT', Sequelize.col('guest_phone')), 'guest_phone'],
              // [Sequelize.fn('GROUP_CONCAT', Sequelize.col('guest_address')), 'guest_address'],
            ],
            group: ['guest_email'],
            raw: true
          });
          console.log("🚀 ~ routes.get ~ distinctCustomer:", distinctCustomer)
          
      res.render('all-customer', {
        name: req.user.name,
        email: req.user.email,
        roleName: req.user.roleName,
        customers: distinctCustomer,
      });
    })

  routes.get("/payment-mode",checkAuthCookie,expressAsyncHandler(async (req,res) => {
      if (req.query.id && req.query.status) {
        const updatePaymentMode = await PaymentMode.update({status:req.query.status},{where: {_id: req.query.id}})
        if (updatePaymentMode) {
            const findPaymentMode = await PaymentMode.findAll()
            console.log("🚀 ~ routes.get ~ findPaymentMode:", findPaymentMode)
            return res.render('payment-mode', {
                  name: req.user.name,
                  email: req.user.email,
                  roleName: req.user.roleName,
                  paymentmode:findPaymentMode
            })
        }
      }
      const findPaymentMode = await PaymentMode.findAll()
      return res.render('payment-mode', {
            name: req.user.name,
            email: req.user.email,
            roleName: req.user.roleName,
            paymentmode:findPaymentMode
      })
  }))


module.exports = routes