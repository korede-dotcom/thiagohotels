const HotelConfig = require('../models/HotelConfig');

class HotelConfigRepository {
  async create(configData) {
    try {
      const config = await HotelConfig.create(configData);
      return config;
    } catch (err) {
      throw new Error('Could not create hotel config');
    }
  }

  async findById(configId) {
    try {
      const config = await HotelConfig.findByPk(configId);
      return config;
    } catch (err) {
      throw new Error('Could not find hotel config');
    }
  }

  async findAll() {
    try {
      const configs = await HotelConfig.findAll({order: [['createdAt', 'DESC']]});
      return configs;
    } catch (err) {
      throw new Error('Could not get hotel configs');
    }
  }

  async findAllActive() {
    try {
      const configs = await HotelConfig.findAll({where:{status:true},order: [['createdAt', 'DESC']]});
      return configs;
    } catch (err) {
      throw new Error('Could not get hotel configs');
    }
  }
  async findAllActiveByBranch(branch) {
    try {
      const configs = await HotelConfig.findAll({where:{status:true,branch:branch},order: [['createdAt', 'DESC']]});
      return configs;
    } catch (err) {
      throw new Error('Could not get hotel configs');
    }
  }

  async findAllPending() {
    try {
      const configs = await HotelConfig.findAll({where:{status:false}});
      return configs;
    } catch (err) {
      throw new Error('Could not get hotel configs');
    }
  }
  
  async findAllPendingByBranch(branch) {
    try {
      const configs = await HotelConfig.findAll({where:{status:false,branch:branch}});
      return configs;
    } catch (err) {
      throw new Error('Could not get hotel configs');
    }
  }

  async update(configId, newData) {
    try {
    //   const config = await HotelConfig.findById(configId);
      const updatedConfig = await HotelConfig.update(newData,{where:{_id:configId},returning:true});
      return updatedConfig[1][0];
    } catch (err) {
      throw new Error('Could not update hotel config');
    }
  }

  async approve (configId) {
    try {
      const config = await HotelConfig.findById(configId);
      const updatedConfig = await config.update({status:true});
      return updatedConfig;
    } catch (err) {
      throw new Error('Could not update hotel config');
    }
  }

  async delete(configId) {
    try {
      const config = await HotelConfig.findById(configId);
      await config.destroy();
    } catch (err) {
      throw new Error('Could not delete hotel config');
    }
  }
}

module.exports = new HotelConfigRepository();
