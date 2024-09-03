const { Op } = require("sequelize");
const GymConfig = require("../models/GymConfig");

class GymConfigRepository {
  async create(gymConfig) {
    try {
      const createdGymConfig = await GymConfig.create(gymConfig);
      return createdGymConfig;
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      const foundGymConfig = await GymConfig.findByPk(id);
      return foundGymConfig;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const allGymConfigs = await GymConfig.findAll({order: [['createdAt', 'DESC']]});
      return allGymConfigs;
    } catch (error) {
      throw error;
    }
  }

  async findAllActive() {
    try {
      const allGymConfigs = await GymConfig.findAll({where:{status:true},order: [['createdAt', 'DESC']]});
      return allGymConfigs;
    } catch (error) {
      throw error;
    }
  }
  async findAllActiveByBranch (branch) {
    console.log("🚀 ~ file: gym-manager-repo.js:41 ~ GymConfigRepository ~ findAllActiveByBranch ~ branch:", branch)
    try {
      const allGymConfigs = await GymConfig.findAll({where:{status:true,branch:branch},order: [['createdAt', 'DESC']]});
      return allGymConfigs;
    } catch (error) {
      throw error;
    }
  }

  async findAllPending() {
    try {
      const allGymConfigs = await GymConfig.findAll({where:{status:false}});
      return allGymConfigs;
    } catch (error) {
      throw error;
    }
  }

  async findAllPendingByBranch (branch) {
    try {
      const allGymConfigs = await GymConfig.findAll({where:{status:false,branch:branch}});
      return allGymConfigs;
    } catch (error) {
      throw error;
    }
  }

  async approve (id) {
    try {
      const [rowsUpdated, updatedGymConfigs] = await GymConfig.update({status:true}, {
        where: { _id: id },
        returning: true,
      });
      return updatedGymConfigs[0];
    } catch (error) {
      throw error;
    }
  }
  async updateById(id, gymConfig) {
    try {
      const [rowsUpdated, updatedGymConfigs] = await GymConfig.update(gymConfig, {
        where: { _id: id },
        returning: true,
      });
      return updatedGymConfigs[0];
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id) {
    try {
      const deletedRows = await GymConfig.destroy({
        where: { _id: id },
      });
      return deletedRows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new GymConfigRepository();
