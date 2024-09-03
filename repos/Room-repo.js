const Branch = require('../models/Branch');
const Room = require('../models/Room');
const HotelBooking = require('../models/HotelBooking');
const { Sequelize:sequelize,Op } = require('sequelize');
const RoomNumber = require('../models/RoomNumbers');
const {v4: uuidv4} = require("uuid");


class RoomRepository {
  async create(configData) {
      const config = await Room.create(configData);
      return config;
  }

  async findById(configId) {
      const config = await Room.findByPk(configId);
      return config;
  }

  async findAll() {
      const configs = await Room.findAll({ order: [['createdAt', 'DESC']]});
      return configs;
  }

  async findAllPending() {
      const configs = await Room.findAll({where:{status:false},order: [['createdAt', 'DESC']]});
      return configs;
  }

  async findAllPendingByBranch (branch) {
      const configs = await Room.findAll({where:{status:false,branch_id:branch},order: [['createdAt', 'DESC']]});
      return configs;
  }
  async findAllApprove() {
    Room.belongsTo(Branch, { foreignKey: 'branch_id',});

      const configs = await Room.findAll({where:{},include:{model:Branch}});
      return configs;
  
  }
  async findDistint() {
    Room.belongsTo(Branch, { foreignKey: 'branch_id',});

    const config = await Room.findAll({where:{status:true},include:{model:Branch}});
        const uniquePkgs = {};

    config.forEach((pkg) => {
    if (!uniquePkgs[pkg.type]) {
        uniquePkgs[pkg.type] = pkg;
    }
    });
    const configs = Object.values(uniquePkgs);

    return configs;
  
  }
  async findAllApproveByBranch (branch) {
  console.log("🚀 ~ file: Room-repo.js:63 ~ RoomRepository ~ findAllApproveByBranch ~ branch:", branch)
  
      const configs = await Room.findAll({where:{status:true,branch_id:branch}});
      return configs;
   
  }

  async findAvailableRooms(branch) {
    Room.belongsTo(HotelBooking,{foreignKey:"_id"})
    
    const now = new Date();
    
    const availableRooms = await Room.findAll({
      where: {
        branch_id: branch,
        status: true,
      },
      include: [
        {
          model: HotelBooking,
          required: false,
          where: {
            [sequelize.Op.or]: [
              { end: { [sequelize.Op.lte]: now } }, // Booking has ended
              { start: { [sequelize.Op.gte]: now } }, // Booking is in the future
            ],
          },
        },
      ],
      having: sequelize.literal(`"hotelbookings"."id" IS NULL`), // Rooms without bookings
    });
    
    return availableRooms;
  }


  async findAvailableRoomsGeneral (branch) {
    Room.belongsTo(HotelBooking,{foreignKey:"_id"})
    
    const now = new Date();
    
    const availableRooms = await Room.findAll({
      where: {
        // branch_id: branch,
        status: true,
      },
      include: [
        {
          model: HotelBooking,
          required: false,
          where: {
            [sequelize.Op.or]: [
              { end: { [sequelize.Op.lte]: now } }, // Booking has ended
              { start: { [sequelize.Op.gte]: now } }, // Booking is in the future
            ],
          },
        },
      ],
    // having: sequelize.literal(`"hotelbooking"."room_id" IS NULL`), // Correctly reference the alias
  });

  return availableRooms;
  } 

  async update(configId, newData) {
  
      const config = await this.findById(configId);
      const updatedConfig = await config.update(newData);
      return updatedConfig;
  
  }
  async approve(id) {
  

      const updatedConfig = await Room.update({status:true},{where:{_id:id}},{returning:true});
      return updatedConfig;
  
  }

  async delete(configId) {

      const config = await this.findById(configId);
      await config.destroy();
   
  }

  async roomNumber(id){
    const catego = await RoomNumber.findAll({
      where: {
          category_id: id
      },
      order: [
          ['status', 'ASC'] // Orders by `status` with `false` first
      ]
  });
  
    return catego;

  }
  async roomCategorys() {
    const categories = await Room.sequelize.query(`
      SELECT 
        rc.*, 
        COALESCE(r.roomcount, 0) AS roomcount
      FROM 
        roomcategories rc
      LEFT JOIN 
        (SELECT 
            category_id, 
            COUNT(*) AS roomcount
         FROM 
            roomnumbers
         GROUP BY 
            category_id
        ) r ON rc._id = r.category_id;
    `, {
      type: Room.sequelize.QueryTypes.SELECT
    });
    
    
    return categories;
    
  }
  async deletecategory(id) {
    const categories = await Room.destroy({where: {_id: id}})
    console.log("🚀 ~ RoomRepository ~ deletecategory ~ categories:", categories)
    const deleteRoom = await RoomNumber.destroy({where: {category_id: id}});
    console.log("🚀 ~ RoomRepository ~ deletecategory ~ deleteRoom:", deleteRoom)
    
    return categories;
    
  }

  async Bookings () {
    HotelBooking.belongsTo(Room,{foreignKey:"room_id"})
    Room.belongsTo(Branch, { foreignKey: 'branch_id' });
    const Allbookings = await HotelBooking.findAll({include:[{model:Room,include: [
        {
          model: Branch, // Include the Branch association
          required: true, // Adjust this based on your requirement
        },
      ],}]});
    return Allbookings;
  }
  async createRoomUnderCat (body) {
   console.log("🚀 ~ RoomRepository ~ createRoomUnderCat ~ body:", body)
   
    const createRoom = await RoomNumber.create(body);
    console.log("🚀 ~ RoomRepository ~ createRoomUnderCat ~ createRoom:", createRoom)
    return createRoom;
  }

  async BranchBookings (branch) {
    const Allbookings = await HotelBooking.findAll({where:{branch_id:branch},include:[{model:Room,include: [
        {
          model: Branch, // Include the Branch association
          required: true, // Adjust this based on your requirement
        },
      ],}]});
    return Allbookings;
  }
  async RoomBook (body) {
    const referenceGenerator = () => {
        let uuid = "";
        while (uuid.length < 5) {
          uuid = uuidv4().replace(/-/g, "").substring(0, 10);
        }
        return uuid;
      };

    const booked = await HotelBooking.create({...body,reference_id:`SMBH${referenceGenerator()}`})
    return booked;
  }
  
}

module.exports = new RoomRepository();
