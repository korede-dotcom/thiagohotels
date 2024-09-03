const hotelConfigRepository = require("../repos/Room-repo")
const asynchandler = require("express-async-handler")
const cloudinaryRepo = require("../repos/cloudinary");
const RoomNumber = require("../models/RoomNumbers");
const Room = require("../models/Room");
const HotelBooking = require("../models/HotelBooking");
const { Op,Sequelize } = require("sequelize");
const moment = require("moment");
const sequelize = require("sequelize");

const getPkgs = asynchandler( async (req,res) => {
    
    const pkgs = await hotelConfigRepository.findAll()
    return res.status(200).json({
        message:"hotel pkgs fetched",
        data:{
            pkgs
        }
    })
});

const getActivePkgs = asynchandler( async (req,res) => {
    if(req.user.role_id !== 1){
        const pkgs = await hotelConfigRepository.findAllApproveByBranch(parseInt(req.user.branch))
        return res.status(200).json({
            message:"hotel pkgs fetched",
            data:{
                pkgs
            }
        })
        
    }else{
        const pkgs = await hotelConfigRepository.findAllApprove()
        return res.status(200).json({
            message:"hotel pkgs fetched",
            data:{
                pkgs
            }
        })
    }
});

const getAavailableRoom = asynchandler( async (req,res) => {
    if(req.user.role_id !== 1){
        const pkgs = await hotelConfigRepository.findAvailableRooms(parseInt(req.user.branch))
        return res.status(200).json({
            message:"hotel pkgs fetched",
            data:{
                pkgs
            }
        })
        
    }else{
        const pkgs = await hotelConfigRepository.findAvailableRoomsGeneral()
        return res.status(200).json({
            message:"hotel pkgs fetched",
            data:{
                pkgs
            }
        })
    }
});

const getBookings = asynchandler( async (req,res) => {
    if(req.user.role_id !== 1){
        const pkgs = await hotelConfigRepository.BranchBookings(parseInt(req.user.branch))
        return res.status(200).json({
            message:"hotel pkgs fetched",
            data:{
                pkgs
            }
        })
        
    }else{
        const pkgs = await hotelConfigRepository.Bookings()
        console.log("🚀 ~ file: Hotelmanager.js:70 ~ getBookings ~ pkgs:", pkgs)
        return res.status(200).json({
            message:"hotel pkgs fetched",
            data:{
                pkgs
            }
        })
    }
});



const clientHotelRoom = asynchandler(async (req,res) => {
    const pkgs = await hotelConfigRepository.roomCategorys()
    res.render('index', {
        pkgs: pkgs,
      });
})

const paymentResult = asynchandler(async (req, res) => {
    console.log("===========", req.query);

        const findBookings = await HotelBooking.findOne({
            where: { reference_id: req.query.reference.toString().trim() }
        });
        console.log("🚀 ~ paymentResult ~ findBookings:", findBookings)
       
        const booking = findBookings;
          
        console.log("Booking object:", booking); // Log the booking object to verify its structure
        
       return res.render("success", { booking:booking });  

  })

const clientRoomAvailable = asynchandler(async (req, res) => {
    const { id, data,start,end } = req.query;
    console.log("🚀 ~ clientRoomAvailable ~ id, data,start,end:", id, data,start,end)

    // Split the data string into an array of room numbers
    const roomNumbers = data?.split(',');

    // Ensure RoomNumber knows about its relationship to Room
    RoomNumber.belongsTo(Room, { foreignKey: 'category_id',targetKey:"_id" });

    // Query all RoomNumbers that match any of the room numbers in the array
    const totalRooms = await RoomNumber.findAll({
        where: {
            room_number: {
                [Sequelize.Op.in]: roomNumbers // Use Sequelize's $in operator
            },
            category_id:id
        },
        include: [{
            model: Room
        }]
    });

    const selectedRoomNumber = totalRooms[0];
    const dates = {
        start,
        end
    }

    return res.render('room-details', { totalRooms: totalRooms,name:"ddd",selectedRoomNumber:selectedRoomNumber,start:start,end:end });
});




const GetAvailability = asynchandler(async (req, res) => {
    let { category_id, start, end } = req.query;

    // Get the current date in the format 'YYYY-MM-DD'
    const currentDate = moment().format("YYYY-MM-DD");

    // Parse the start date
    let startDate = moment(start, "DD-MM-YYYY").format("YYYY-MM-DD");

    // Check if the start date is in the past
    if (moment(startDate).isBefore(currentDate)) {
        return res.json({
            message: "Start date cannot be in the past. Please select a valid date.",
            status: false
        });
    }

    // Parse the end date
    const endDate = moment(end, "DD-MM-YYYY").format("YYYY-MM-DD");

    // Find the total number of rooms in the category
    const totalRooms = await RoomNumber.count({
        where: { category_id }
    });

    // Find the number of rooms already booked that overlap with the given date range
    const bookedRooms = await HotelBooking.count({
        where: {
            category_id,
            status:"success",
            [Op.or]: [
                {
                    start: {
                        [Op.between]: [
                            Sequelize.literal(`TO_TIMESTAMP('${startDate} 12:00:00+01', 'YYYY-MM-DD HH24:MI:SS')`),
                            Sequelize.literal(`TO_TIMESTAMP('${endDate} 12:00:00+01', 'YYYY-MM-DD HH24:MI:SS')`)
                        ]
                    }
                },
                {
                    end: {
                        [Op.between]: [
                            Sequelize.literal(`TO_TIMESTAMP('${startDate} 12:00:00+01', 'YYYY-MM-DD HH24:MI:SS')`),
                            Sequelize.literal(`TO_TIMESTAMP('${endDate} 12:00:00+01', 'YYYY-MM-DD HH24:MI:SS')`)
                        ]
                    }
                },
                {
                    [Op.and]: [
                        {
                            start: {
                                [Op.lte]: Sequelize.literal(`TO_TIMESTAMP('${startDate} 12:00:00+01', 'YYYY-MM-DD HH24:MI:SS')`)
                            }
                        },
                        {
                            end: {
                                [Op.gte]: Sequelize.literal(`TO_TIMESTAMP('${endDate} 12:00:00+01', 'YYYY-MM-DD HH24:MI:SS')`)
                            }
                        }
                    ]
                }
            ]
        }
    });

    const availableRooms = totalRooms - bookedRooms;
    console.log("🚀 ~ GetAvailability ~ availableRooms:", availableRooms);

    // Fetch details of available rooms that are not booked in the given date range
    const availableRoomDetails = await RoomNumber.findAll({
        where: {
            category_id,
            _id: {
                [Op.notIn]: Sequelize.literal(`(
                    SELECT "room_id" FROM "hotelbookings" 
                    WHERE "category_id" = ${category_id} 
                    AND (
                        "start" BETWEEN TO_TIMESTAMP('${startDate} 12:00:00+01', 'YYYY-MM-DD HH24:MI:SS')
                        AND TO_TIMESTAMP('${endDate} 12:00:00+01', 'YYYY-MM-DD HH24:MI:SS')
                        OR "end" BETWEEN TO_TIMESTAMP('${startDate} 12:00:00+01', 'YYYY-MM-DD HH24:MI:SS')
                        AND TO_TIMESTAMP('${endDate} 12:00:00+01', 'YYYY-MM-DD HH24:MI:SS')
                        OR "start" <= TO_TIMESTAMP('${startDate} 12:00:00+01', 'YYYY-MM-DD HH24:MI:SS')
                        AND "end" >= TO_TIMESTAMP('${endDate} 12:00:00+01', 'YYYY-MM-DD HH24:MI:SS')
                    )
                )`)
            }
        }
    });

    console.log("🚀 ~ GetAvailability ~ availableRoomDetails:", availableRoomDetails);
    console.log("🚀 ~ GetAvailability ~ availableRoomDetails.length:", availableRoomDetails.length);

    if (availableRoomDetails.length) {
        return res.json({
            message: "Yay! We found you a room",
            status: true,
            data: {
                availableRooms,
                availableRoomDetails,
                totalRooms,
                bookedRooms,
                category_id
            }
        });
    }

    return res.json({
        message: "No room available in this category",
        status: false,
        data: {
            availableRooms,
            availableRoomDetails,
            totalRooms,
            bookedRooms,
            category_id
        }
    });
});

const GetAvailabilityToday = asynchandler(async (req, res) => {
    // Get the current date in the format 'YYYY-MM-DD'
        const currentDate = moment().format("YYYY-MM-DD");

        // Find the categories and count of all rooms within each category
        const categories = await Category.findAll({
            include: [{
                model: Room,
                attributes: []
            }],
            attributes: {
                include: [
                    [sequelize.fn('COUNT', sequelize.col('Rooms.id')), 'totalRooms']
                ]
            },
            group: ['Category.id']
        });

        // Find all bookings for today
        const bookings = await Booking.findAll({
            where: {
                [Op.or]: [
                    {
                        start: {
                            [Op.lte]: moment().endOf('day').toDate()
                        }
                    },
                    {
                        end: {
                            [Op.gte]: moment().startOf('day').toDate()
                        }
                    }
                ]
            }
        });

        // Map booked room IDs
        const bookedRoomIds = bookings.map(booking => booking.roomId);

        // Get available rooms that are not booked for today, grouped by category
        const availableRooms = await Room.findAll({
            where: {
                id: {
                    [Op.notIn]: bookedRoomIds
                }
            },
            include: [
                {
                    model: Category,
                    attributes: ['name']
                }
            ]
        });

        // Format the response
        const result = categories.map(category => {
            const roomsInCategory = availableRooms.filter(room => room.categoryId === category.id);
            return {
                category: category.name,
                totalRooms: category.get('totalRooms'),
                availableRooms: roomsInCategory.length
            };
        });

        if (result.length) {
            return res.json({
                message: "Available rooms for today",
                status: true,
                data: result
            });
        }

        return res.json({
            message: "No rooms available today",
            status: false,
            data: result
        });
});





const getPendingPkgs = asynchandler( async (req,res) => {
    if(req.user){
        const pkgs = await hotelConfigRepository.findAllPendingByBranch(req.user.branch)
        return res.status(200).json({
            message:"hotel pkgs fetched",
            data:{
                pkgs
            }
        })
    }else{
        const pkgs = await hotelConfigRepository.findAllPending()
        return res.status(200).json({
            message:"hotel pkgs fetched",
            data:{
                pkgs
            }
        })

    }
});

const approve = asynchandler( async (req,res) => {
    if(!req.query.id){
        return res.status(400).json({
            status:false,
            message:"please pass id",
        
        })
    }
    const pkgs = await hotelConfigRepository.approve(req.query.id)
    return res.status(200).json({
        message:"hotel pkgs fetched",
        data:{
            pkgs
        }
    })
});

const createhotelpkg = asynchandler(async (req,res) => {
 
  const upload = await cloudinaryRepo.uploadMany(req.files)
  console.log("🚀 ~ file: Hotelmanager.js:77 ~ createhotelpkg ~ upload:", upload)
   const imageObject = upload.map(url => {
       return {        
           secure_url: url.secure_url,
           url:url.url
           
       }

   });

   if(req.user.role_id === 1){
    const createeventpackage = await hotelConfigRepository.create({...req.body,branch_id:req.body.branch,status:true,picture:[...imageObject.map(r => r.secure_url)]})
    return res.status(200).json({
        status:true,
        message:"hotel roomn created ",
        data:{
            createeventpackage
        }
    })
   }

    const createeventpackage = await hotelConfigRepository.create({...req.body,status:false,picture:[...imageObject.map(r => r.secure_url)]})
    return res.status(200).json({
        status:true,
        message:"hotel roomn created ",
        data:{
            createeventpackage
        }
    })
});

const createRoomUnderCat =  asynchandler(async (req,res) => {
    const findCategory = await  hotelConfigRepository.findById(req.body.category_id);
    if (!findCategory) {
       return res.status(400).json({
            status: false,
            message: "Category not found"
        })
    }
    const roomnumber = await hotelConfigRepository.createRoomUnderCat({...req.body})
    return res.status(200).json({
        message:"room created under category ",
        data:{
            roomnumber
        }
    })
})


const getAllcategories = asynchandler(async (req, res) =>{
    const categories = await hotelConfigRepository.roomCategorys()
    return res.status(200).json({
        message:"hotel categories fetched",
        data:{
            categories
        }
    })
})

const updatehotelmpkg = asynchandler( async (req,res) => {
    const createeventpackage = await hotelConfigRepository.update(req.query.id,{...req.body,status:false})
    return res.status(200).json({
        message:"event hotel package updated ",
        data:{
            createeventpackage
        }
    })
});

const bookRoom = asynchandler (async (req,res) => {
    const createeventpackage = await hotelConfigRepository.RoomBook(req.body)
    return res.status(200).json({
        message:"event hotel package updated ",
        data:{
            createeventpackage
        }
    })
})



module.exports = {
    getPkgs,
    createhotelpkg,
    updatehotelmpkg,
    getActivePkgs,
    getPendingPkgs,
    approve,
    clientHotelRoom,
    getAavailableRoom,
    getBookings,
    bookRoom,
    createRoomUnderCat,
    getAllcategories,
    GetAvailability,
    clientRoomAvailable,
    paymentResult,
    GetAvailabilityToday
};


