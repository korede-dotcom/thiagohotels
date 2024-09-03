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
      const configs = await HotelConfig.findAll({ order: [['createdAt', 'DESC']]});
      return configs;
    } catch (err) {
      throw new Error('Could not get hotel configs');
    }
  }

  async findAllPending() {
    try {
      const configs = await HotelConfig.findAll({where:{status:false},order: [['createdAt', 'DESC']]});
      return configs;
    } catch (err) {
      throw new Error('Could not get hotel configs');
    }
  }

  async findAllPendingByBranch (branch) {
    try {
      const configs = await HotelConfig.findAll({where:{status:false,branch:branch},order: [['createdAt', 'DESC']]});
      return configs;
    } catch (err) {
      throw new Error('Could not get hotel configs');
    }
  }

  async findAllApprove() {
    try {
      const configs = await HotelConfig.findAll({where:{status:true}});
      return configs;
    } catch (err) {
      throw new Error('Could not get hotel configs');
    }
  }
  async findAllApproveByBranch (branch) {
    try {
      const configs = await HotelConfig.findAll({where:{status:true,branch:branch}});
      return configs;
    } catch (err) {
      throw new Error('Could not get hotel configs');
    }
  }

  async update(configId, newData) {
    try {
      const config = await this.findById(configId);
      const updatedConfig = await config.update(newData);
      return updatedConfig;
    } catch (err) {
      throw new Error('Could not update hotel config');
    }
  }

  async delete(configId) {
    try {
      const config = await this.findById(configId);
      await config.destroy();
    } catch (err) {
      throw new Error('Could not delete hotel config');
    }
  }
}

module.exports = new HotelConfigRepository();
