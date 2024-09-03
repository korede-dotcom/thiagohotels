const { Op } = require('sequelize');
const EventBooking = require('../models/EventBookers');
const EventConfig = require("../models/EventConfig");
const Branch = require('../models/Branch');

class EventBookingRepository {
  async getAll() {
    EventBooking.belongsTo(EventConfig,{foreignKey:"event_type",targetKey:"_id"})
    EventBooking.belongsTo(Branch,{foreignKey:"branch_id",targetKey:"_id"})
    return await EventBooking.findAll({include:[{model:EventConfig},{model:Branch}]});
  }

  async getById(id) {
    return await EventBooking.findByPk(id);
  }
  async getByBranchId(id) {
    EventBooking.belongsTo(EventConfig,{foreignKey:"event_type",targetKey:"_id"})
    EventBooking.belongsTo(Branch,{foreignKey:"branch_id",targetKey:"_id"})
    return await EventBooking.findAll({where:{branch_id:id},include:[{model:EventConfig},{model:Branch}]});
  }

  async create(eventBooking) {
    return await EventBooking.create(eventBooking);
  }

  async checkDate (date,branch_id) {
   return EventBooking.findOne({
      where: {
        date: date,
        branch_id:branch_id
      },
    });
  }

  async update(id, eventBooking) {
    const foundEventBooking = await EventBooking.findByPk(id);
    if (!foundEventBooking) {
      return null;
    }
    return await foundEventBooking.update(eventBooking);
  }

  async delete(id) {
    const foundEventBooking = await EventBooking.findByPk(id);
    if (!foundEventBooking) {
      return null;
    }
    await foundEventBooking.destroy();
    return foundEventBooking;
  }

  async eventCount (type) {
    switch (type) {
      case cash:
        const countCash = await EventBooking.count({where:{payment_mode:type}});
        return countCash;
        break;  
      default:
        const count = await EventBooking.count();
        return count;
        break;
    }

  }
  async eventCountByBranch (id) {
        const countCash = await EventBooking.count({where:{branch_id:id}});
        return countCash;
  }
}



module.exports = EventBookingRepository;
