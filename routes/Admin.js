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
const Staff = require("../models/Staff");
const User = require("../models/User");
const connectDB = require("../config/connectDB");
const bcrypt = require("bcryptjs");
const Drink = require("../models/Drinks");
const DrinkLog = require("../models/DrinksLog");
const {Op} = require("sequelize");
const sequelize = require("sequelize");
const SendEmail = require("../utils/sendEmail");
const ResetPassword = require("../models/ResetPassword");
const Marque = require("../models/Marque");

routes.get("/",async (req,res) => {
            res.render('login', {
              pkgs: "jhgfhghh",
            });
          
      })
routes.get("/dashboard/monthly-bookings",checkAuthCookie,async (req,res) => {
      const monthlyData = await HotelBooking.findAll({
            attributes: [
              [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'month'],
              [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],  // Sum the amounts
              [sequelize.fn('COUNT', sequelize.col('id')), 'count']            // Count of bookings
            ],
            where: {
              status: 'success'  // Filter by status = "success"
            },
            group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt'))],
            order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'ASC']]
          });

          const weeklyData = await HotelBooking.findAll({
            attributes: [
              [sequelize.fn('DATE_TRUNC', 'week', sequelize.col('createdAt')), 'week'],  // Group by week
              [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],  // Sum the amounts
              [sequelize.fn('COUNT', sequelize.col('id')), 'count']           // Count of bookings
            ],
            where: {
              status: 'success'  // Filter by status = "success"
            },
            group: [sequelize.fn('DATE_TRUNC', 'week', sequelize.col('createdAt'))],
            order: [[sequelize.fn('DATE_TRUNC', 'week', sequelize.col('createdAt')), 'ASC']]
          });
          console.log("🚀 ~ routes.get ~ weeklyData:", weeklyData)
          
      
          
          return res.json({
            monthlyData:monthlyData,
            weeklyData:weeklyData
      });
})
routes.get("/dashboard",checkAuthCookie,async (req,res) => {

// Get the current date in 'YYYY-MM-DD' format
const currentDate = new Date().toISOString().slice(0, 10); 
const totalAmountForWebOnline = await HotelBooking.findAll({
      where: {
        status: 'success',
        booked_from: 'web-online',
        [Op.or]: [
          sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), currentDate),
          sequelize.where(sequelize.fn('DATE', sequelize.col('updatedAt')), currentDate)
        ]
      },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'bookingCount'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']
      ]
    });
    console.log("🚀 ~ routes.get ~ totalAmountForWebOnline:", totalAmountForWebOnline[0].dataValues)
    
    const totalAmountForReception = await HotelBooking.findAll({
      where: {
        status: 'success',
        booked_from: 'reception',
        [Op.or]: [
          sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), currentDate),
          sequelize.where(sequelize.fn('DATE', sequelize.col('updatedAt')), currentDate)
        ]
      },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'bookingCount'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']
      ]
    });
    console.log("🚀 ~ routes.get ~ totalAmountForReception:", totalAmountForReception)
const totalAmount = await HotelBooking.findAll({
  where: {
    status: 'success',
    [Op.or]: [
      sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), currentDate),
      sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), currentDate)
    ]
  },
  attributes: [
    [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']
  ]
});


// Get the result as a number
const total = totalAmount[0].get('totalAmount') || 0;
const availableroomCount = await RoomNumber.count({where:{status:false}})
const roomCount = await RoomNumber.count({where:{}})


console.log(`Total amount for bookings with status 'success' on ${currentDate}: ${total}`);
const totalStaff = await Staff.count({where:{status:true}})
const distinctCustomer = await HotelBooking.findAll({
      attributes: [
        'guest_email',
        [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN status = 'success' THEN 1 ELSE 0 END`)), 'success_count'],
        [Sequelize.fn('MIN', Sequelize.col('guest_name')), 'guest_name'], // Choose the first occurrence of guest_name
        [Sequelize.fn('MIN', Sequelize.col('guest_phone')), 'guest_phone'], // Choose the first occurrence of guest_phone
        [Sequelize.fn('MIN', Sequelize.col('guest_address')), 'guest_address'] // Choose the first occurrence of guest_address
      ],
      group: ['guest_email'],
      raw: true
    });
const barSummary = await DrinkLog.findAll({
      where: {
      
        [Op.or]: [
          sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), currentDate),
          sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), currentDate)
        ]
      },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']
      ]
    });
   let barTotal = barSummary[0].get('totalAmount') || 0;


   const totalDrink = await Drink.count({where:{}})

    
           return res.render('index', {
              name: req.user.name ,
              email: req.user.email ,
              roleName:req.user.roleName,
              data:{
                  todayBooking:total,
                  availableroomCount:availableroomCount,
                  totalStaff:totalStaff,
                  customerCount:distinctCustomer.length,
                  todayBarSummary:barTotal,
                  totalDrink:totalDrink,
                  totalAmountForWebOnline:totalAmountForWebOnline[0].dataValues,
                  totalAmountForReception:totalAmountForReception[0].dataValues,
                  roomCount:roomCount
                  // totalAmountByBookedFrom:totalAmountByBookedFrom
                  
              }
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
      if(req.query.id) {
           
            const categories = await RoomRepo.categoryById(req.query.id)
                return  res.render('edit-room-category', {
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
routes.post("/edit-room-category",checkAuthCookie,async (req,res) => {
      // if(req.query.type === "delete" && req.query.id) {
      //       const catego = await RoomRepo.deletecategory(req.query.id)
      //       console.log("🚀 ~ routes.get ~ catego:", catego)
      //       const categories = await RoomRepo.roomCategorys()
      //           return  res.render('roomcategory', {
      //               name: req.user.name ,
      //               email: req.user.email ,
      //               roleName:req.user.roleName,
      //               categories:categories
      //             });
      
      // }
      const categories = await RoomRepo.editcategory(req.query.id,req.body)
           if (categories.length > 0) {
            return res.json({status:true,message:"success"})
           }
           return res.json({status:fslse,message:"error while editing category"})
      })
routes.get("/edit-room-category",checkAuthCookie,async (req,res) => {
      // if(req.query.type === "delete" && req.query.id) {
      //       const catego = await RoomRepo.deletecategory(req.query.id)
      //       console.log("🚀 ~ routes.get ~ catego:", catego)
      //       const categories = await RoomRepo.roomCategorys()
      //           return  res.render('roomcategory', {
      //               name: req.user.name ,
      //               email: req.user.email ,
      //               roleName:req.user.roleName,
      //               categories:categories
      //             });
      
      // }
      const categories = await RoomRepo.roomCategorys()
            res.render('edit-room-category', {
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
      const hasQueryParams = Object.keys(req.query).length > 0;
      if (req.query.room_number) {
            const bookings = await HotelBooking.findAll({
                  where: {
                    room_number: req.query.room_number,
                    status:"success"
                  },
                  order: [
                    ['createdAt', 'DESC']
                  ]
                });
                
      
            return res.render('all-booking', {
                  name: req.user.name ,
                  email: req.user.email ,
                  roleName:req.user.roleName,
                  bookings:bookings,
                  hasQueryParams:hasQueryParams
                }) 
      }
      if (req.query.type) {
            let bookings;
            switch (req.query.type) {
                  case "web-online":
                        bookings = await HotelBooking.findAll({
                              where: {
                                booked_from:"web-online"
                              },
                              order: [
                                ['createdAt', 'DESC']
                              ]
                            });
                            
                  
                        return res.render('all-booking', {
                              name: req.user.name ,
                              email: req.user.email ,
                              roleName:req.user.roleName,
                              bookings:bookings,
                              hasQueryParams:hasQueryParams
                            }) 
                        break;
            
                  default:
                        bookings = await HotelBooking.findAll({
                              where: {
                                booked_from:"reception"
                              },
                              order: [
                                ['createdAt', 'DESC']
                              ]
                            });
                            
                  
                        return res.render('all-booking', {
                              name: req.user.name ,
                              email: req.user.email ,
                              roleName:req.user.roleName,
                              bookings:bookings,
                              hasQueryParams:hasQueryParams
                            }) 

                        break;
            }
          
      }
      const bookings = await HotelBooking.findAll({order: [['createdAt', 'DESC']]})
      
      res.render('all-booking', {
            name: req.user.name ,
            email: req.user.email ,
            roleName:req.user.roleName,
            bookings:bookings,
            hasQueryParams:false,
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
      if (req.query.phonenumber) {
            const bookings = await HotelBooking.findAll({
                  where: {
                        guest_phone: req.query.phonenumber
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
          
     return res.render('all-customer', {
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

  routes.get("/all-staff",checkAuthCookie,expressAsyncHandler(async (req, res) => {
      Staff.belongsTo(User,{foreignKey:"user_id"})
      const staffs = await Staff.findAll({
            include: { model: User },
            order: [
                ['createdAt', 'ASC'], // Primary sort column
                ['user', 'name', 'ASC'] // Secondary sort column
            ]
        });
      if (req.query.id && req.query.type) {
            let update;
            switch (req.query.type) {
                  case "activate":
                         update = await User.update({status:true},{where: {_id: req.query.id}})
                        if (update) {
                              return res.render('all-staff', {
                                    name: req.user.name,
                                    email: req.user.email,
                                    roleName: req.user.roleName,
                                    staffs:staffs
                                 
                              })
                        } else {
                              return res.render('all-staff', {
                                    name: req.user.name,
                                    email: req.user.email,
                                    roleName: req.user.roleName,
                                    staffs:staffs
                                 
                              })
                        }
                        break;
                  case "suspend":
                         update = await User.update({status:false},{where: {_id: req.query.id}})
                        if (update) {
                              return res.render('all-staff', {
                                    name: req.user.name,
                                    email: req.user.email,
                                    roleName: req.user.roleName,
                                    staffs:staffs
                                 
                              })
                        } else {
                              return res.render('all-staff', {
                                    name: req.user.name,
                                    email: req.user.email,
                                    roleName: req.user.roleName,
                                    staffs:staffs
                                 
                              })
                        }
                        break;
            
                  default:
                         update = await User.update({status:false},{where: {_id: req.query.id}})
                        if (update) {
                              return res.render('all-staff', {
                                    name: req.user.name,
                                    email: req.user.email,
                                    roleName: req.user.roleName,
                                    staffs:staffs
                                 
                              }) 
                        } else {
                              return res.render('all-staff', {
                                    name: req.user.name,
                                    email: req.user.email,
                                    roleName: req.user.roleName,
                                    staffs:staffs
                                 
                              })
                        }
                      
                        break;
            }
            

      }
      
        
      // staffs.forEach(user => console.log(user.user.name))
      // console.log("🚀 ~ routes.get ~ staffs:", staffs)
      return res.render('all-staff', {
            name: req.user.name,
            email: req.user.email,
            roleName: req.user.roleName,
            staffs:staffs
         
      })
}))
  routes.get("/edit-staff",checkAuthCookie,expressAsyncHandler(async (req, res) => {
     
      return res.render('edit-staff', {
            name: req.user.name,
            email: req.user.email,
            roleName: req.user.roleName,
         
      })
}))
routes.get("/add-staff",checkAuthCookie,expressAsyncHandler(async (req, res) => {
 
      return res.render('add-staff', {
            name: req.user.name,
            email: req.user.email,
            roleName: req.user.roleName,
       
      })
}))

routes.post("/add-staff",checkAuthCookie,expressAsyncHandler(async (req, res) => {
      let transaction
      transaction = await connectDB.transaction()
      console.log("🚀 ~ routes.post ~ req.body:", req.body)
      function generateRandomString(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
              result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
          }
      const randPass = generateRandomString(6)
      console.log("🚀 ~ routes.post ~ randPass:", randPass)
      const saveUser = await User.create({
            name: req.body.first + " " + req.body.last,
            email: req.body.email,
            password: randPass,
            role_id: parseInt(req.body.role),
            

      },{transaction})
      console.log("🚀 ~ routes.post ~ saveUser:", saveUser)
      const saveStaff = await Staff.create({
            user_id: saveUser._id,
            phonenumber: req.body.phonenumber,
            address: req.body.address,
            // designation: req.body.designation,
      },{transaction})
      await transaction.commit()
     

          const sendEmail = await SendEmail(
            "Welcome On Board",
            "",
            `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    <tr>
                      <td align="center" style="background-color: #94081a; padding: 20px;">
                        <h2 style="color: #ffffff; font-size: 24px; margin: 0;">Welcome Aboard!</h2>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px; color: #333;">
                        <p style="font-size: 16px; margin-bottom: 20px;">Hi ${saveUser.name},</p>
                        <p style="font-size: 16px; margin-bottom: 20px;">Welcome to Thiago Hotel and Suites! We're excited to have you as our new staff member with role ${saveUser.roleName} . Below are your login credentials:</p>
                        <p style="font-size: 16px; margin-bottom: 20px;">Email: ${saveUser.email}</p>
                        <p style="font-size: 16px; margin-bottom: 20px;">Password: ${randPass}</p>
                        <p style="font-size: 16px; margin-top: 20px;">You can log in to your account here: <a href="https://thiagohotelandsuites.com/portal" style="color: #94081a; text-decoration: underline;">Thiago Hotel and Suites Portal</a></p>
                        <p style="font-size: 16px; margin-top: 20px;">If you have any questions, feel free to reach out to us.</p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="background-color: #f4f4f4; padding: 20px; color: #666; font-size: 14px;">
                        <p style="margin: 0;">Best regards,</p>
                        <p style="margin: 5px 0 0;">Thiago Hotel and Suites</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            `,
            saveUser.email,
            "thiagohotelandsuites@gmail.com"
        );
        
      // sendSMS
      return res.status(201).json({
            status: true,
            message: 'Staff added successfully',
            data: saveStaff,
      })

}))


routes.get("/info-promotion-create",checkAuthCookie,expressAsyncHandler(async  (req, res) => {
      const promotions = await Marque.findAll({
         
      });
      res.render("promotions", {
            name: req.user.name,
            email: req.user.email,
            roleName: req.user.roleName,
      })
}))
routes.post("/info-promotion-create",checkAuthCookie,expressAsyncHandler(async  (req, res) => {
      

      const promotions = await Marque.create(req.body);
      return res.status(201).json({
            status: true,
            message: 'Promotion created successfully',
            name: req.user.name,
            email: req.user.email,
            roleName: req.user.roleName,
          });
}))
routes.get("/info-promotion",checkAuthCookie,expressAsyncHandler(async  (req, res) => {
      const promotions = await Marque.findAll({
         
      });
      res.render("all-promos", {
            name: req.user.name,
            email: req.user.email,
            roleName: req.user.roleName,
            data:promotions
      })
}))

routes.get("/bar",checkAuthCookie,expressAsyncHandler(async (req,res) => {
      const drinks = await Drink.findAll({
         
      });
      res.render("barRecent", {
            name: req.user.name,
            email: req.user.email,
            roleName: req.user.roleName,
            drinks:JSON.stringify(drinks)
      })
}))
routes.get("/bar-buy-records",checkAuthCookie,expressAsyncHandler(async (req,res) => {
      if (req.query.start && req.query.end) { 
            const DrinkLogs = await DrinkLog.findAll({
                  where: {createdAt: { [Op.gte]: req.query.start, [Op.lte]: req.query.end }},
                  order: [
                    ['createdAt', 'DESC']
                  ]
            });
            res.render("barOlder", {
                  name: req.user.name,
                  email: req.user.email,
                  roleName: req.user.roleName,
                  logs:DrinkLogs
            })
            return
      }
      const DrinkLogs = await DrinkLog.findAll({
            order: [
              ['id', 'DESC']
            ]
      });
      res.render("barOlder", {
            name: req.user.name,
            email: req.user.email,
            roleName: req.user.roleName,
            logs:DrinkLogs
      })
      return
}))
routes.get("/bar-records",checkAuthCookie,expressAsyncHandler(async (req,res) => {
      if (req.query.start && req.query.end) { 
            const DrinkLogs = await DrinkLog.findAll({
                  where: {createdAt: { [Op.gte]: req.query.start, [Op.lte]: req.query.end }},
                  order: [
                    ['id', 'DESC']
                  ]
            });
            res.render("all-bar-records", {
                  name: req.user.name,
                  email: req.user.email,
                  roleName: req.user.roleName,
                  logs:DrinkLogs
            })
            return
      }
      const DrinkLogs = await DrinkLog.findAll({
            order: [
              ['createdAt', 'DESC']
            ]
      });
      res.render("all-bar-records", {
            name: req.user.name,
            email: req.user.email,
            roleName: req.user.roleName,
            logs:DrinkLogs
      })
      return
}))
routes.get("/bar-all-drinks",checkAuthCookie,expressAsyncHandler(async (req,res) => {
      const drinks = await Drink.findAll({
            order: [
              ['id', 'DESC']
            ]
      });
      console.log("🚀 ~ routes.get ~ drinks:", drinks)
     return  res.render("all-drinks", {
            name: req.user.name,
            email: req.user.email,
            roleName: req.user.roleName,
            drinks:JSON.stringify(drinks)
      })
}))

routes.get("/bar-create-drinks",checkAuthCookie,expressAsyncHandler(async(req,res) => {
      return  res.render("test", {
            name: req.user.name,
            email: req.user.email,
            roleName: req.user.roleName,
      })
}))

routes.post("/bar-edit-drinks",checkAuthCookie,expressAsyncHandler(async(req,res) => {
      console.log("��� ~ routes.post ~ req.body:", req.body)
      // const findName = await Drink.findOne({where:{name:req.body.name}})
      // if (findName) {
      //       return res.status(400).json({
      //             status: false,
      //             message: 'Drink already exists',
      //             name: req.user.name,
      //             email: req.user.email,
      //             roleName: req.user.roleName,
      //       }) 
      // }
      const saveBar = await Drink.update({
            name: req.body.name.toLowerCase(),
            totalStock: req.body.totalStock,
            price: req.body.price,
       
      },{where:{id:req.body.id}})
      console.log("🚀 ~ routes.post ~ saveBar:", saveBar)
      return res.status(201).json({
            status: true,
            message: 'Drink updated successfully',
            name: req.user.name,
            email: req.user.email,
            roleName: req.user.roleName,
      })
}))
routes.post("/bar-create-drinks",checkAuthCookie,expressAsyncHandler(async(req,res) => {
      console.log("��� ~ routes.post ~ req.body:", req.body)
      const findName = await Drink.findOne({where:{name:req.body.name}})
      if (findName) {
            return res.status(400).json({
                  status: false,
                  message: 'Drink already exists',
                  name: req.body.name.toLowerCase(),
                  email: req.user.email,
                  roleName: req.user.roleName,
            }) 
      }
      const saveBar = await Drink.create({
            name: req.body.name.toLowerCase(),
            totalStock: req.body.totalStock,
            price: req.body.price,
       
      })
      return res.status(201).json({
            status: true,
            message: 'Drink added successfully',
            data: saveBar,
            name: req.user.name,
            email: req.user.email,
            roleName: req.user.roleName,
      })
}))
routes.post("/bar-buy", checkAuthCookie, expressAsyncHandler(async (req, res) => {
      const transaction = await connectDB.transaction();
      const { customerName, cart } = req.body;  // Extract the customerName and cart
    
      try {
        // Check if cart is an array and contains items
        if (!Array.isArray(cart) || cart.length === 0) {
          return res.status(400).json({ status: false, message: 'Cart is empty' });
        }
    
        // Process each item in the cart
        for (const item of cart) {
          const { id, name, quantity, total } = item;
    
          // Find the drink by ID
          const drink = await Drink.findOne({ where: { id } }, { transaction });
          if (!drink) {
            throw new Error(`Drink with ID ${id} not found`);
          }
    
          // Calculate the updated stock
          const updatedStock = drink.totalStock - quantity;
          if (updatedStock < 0) {
            throw new Error(`Insufficient stock for ${name}`);
          }
    
          // Update the drink's stock
          await drink.update({ totalStock: updatedStock }, { transaction });
    
          // Create a log entry for the transaction
          await DrinkLog.create({
            name: customerName,        // Customer name from request body
            amount: total,             // Total amount for the drink
            drink_name: name,          // Drink name
            quantity: quantity,        // Quantity of drinks purchased
            stockAfterTransaction: updatedStock,
            staff_name: req.user.name, // Staff name from authenticated user
          }, { transaction });
        }
    
        // Commit the transaction after processing all items
        await transaction.commit();
    
        // Respond with success
        return res.status(201).json({
          status: true,
          message: 'Drinks processed successfully',
          name: req.user.name,
          email: req.user.email,
          roleName: req.user.roleName,
        });
    
      } catch (error) {
        // Rollback the transaction if an error occurs
        await transaction.rollback();
    
        // Log the error for debugging purposes
        console.error('Error processing cart:', error);
    
        // Return a 500 status with the error message
        return res.status(500).json({ status: false, message: error.message });
      }
    }));

routes.get("/forgot-password",expressAsyncHandler(async (req,res) => {
      res.render("forgot-password")
}))
routes.get("/first-time",expressAsyncHandler(async (req,res) => {
      res.render("firsttime")
}))

routes.get("/recovery",expressAsyncHandler(async (req,res) => {
       const id = req.query.id;

       if (!id) {
            return  res.redirect('/portal')
        }
       const resetPassword = await ResetPassword.findOne({
            where: {
              token: id,
              expiresAt: { [Op.gt]: new Date() } // Op is Sequelize operator
            }
          });
          
          if (!resetPassword) {
            return res.render("recovery",{status:false})
          }
    
     
      return res.render("recovery",{status:true})
}))

routes.get("/profile",checkAuthCookie,expressAsyncHandler(async (req,res) => {
      res.render("profile",{
            name: req.user.name,
            email: req.user.email,
            roleName: req.user.roleName,
            _id: req.user._id
      })
}))
    



module.exports = routes