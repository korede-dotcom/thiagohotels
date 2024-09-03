const Services = require("../models/Services")


class checkStatus {
    async servicname (name) {
        const service = await Services.findOne({ where: { name: name } });
      if (!service) {
        throw new Error('Service not found');
      }
      if (!service.status) {
        throw new Error('Service is not available');
      }
      // Service status is true, call the next middleware
      next();
    }
  
}

const checkGymStatus = async (req, res, next) => {

  try {
    const service = await Services.findOne({ where: { name: 'gym' } });
    if (!service) {
      return res.json({
        status:false,
        messeage:"service not available"
      })
    }
    if (!service.status) {
      return res.json({
        status:false,
        messeage:"service not available"
      })
    }
    // Service status is true, call the next middleware
    next();
  } catch (error) {
    console.log(error);
    return res.json({
      status:false,
      messeage:"Internal server error"
    })
  }
};
const checkHotelStatus = async (req, res, next) => {

  try {
    const service = await Services.findOne({ where: { name: 'shortlet' } });
    if (!service) {
      return res.json({
        status:false,
        messeage:"service not available"
      })
    }
    if (!service.status) {
      return res.json({
        status:false,
        messeage:"service not available"
      })
    }
    // Service status is true, call the next middleware
    next();
  } catch (error) {
    console.log(error);
    return res.json({
      status:false,
      messeage:"Internal server error"
    })
  }
};

const checkEventStatus = async (req, res, next) => {

  try {
    const service = await Services.findOne({ where: { name: 'eventhall' } });
    if (!service) {
      return res.json({
        status:false,
        messeage:"service not available"
      })
    }
    if (!service.status) {
      return res.json({
        status:false,
        messeage:"service not available"
      })
    }
    // Service status is true, call the next middleware
    next();
  } catch (error) {
    console.log(error);
    return res.json({
      status:false,
      messeage:"Internal server error"
    })
  }
};


module.exports = {
  checkEventStatus,
  checkHotelStatus,
  checkGymStatus
};