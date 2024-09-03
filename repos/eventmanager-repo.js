const Branch = require("../models/Branch");
const EventConfig = require("../models/EventConfig")

const createEventConfig = async (eventConfig) => {
    return await EventConfig.create(eventConfig);
  };
  
  const getEventConfigById = async (id) => {
    return await EventConfig.findByPk(id);
  };
  
  const getAllEventConfigs = async () => {
    EventConfig.belongsTo(Branch,{foreignKey:"branch_id"})
    return await EventConfig.findAll({where:{},include:{model:Branch},order: [['createdAt', 'DESC']]});
  };

  const getAllEventConfigsActive = async (branch) => {
    EventConfig.belongsTo(Branch,{foreignKey:"branch_id"})
    return await EventConfig.findAll({where:{status:true},include:{model:Branch},order: [['createdAt', 'DESC']]});
  
  };

  const getAllEventConfigsActiveBybranch = async (branch) => {
    return await EventConfig.findAll({where:{status:true,branch:branch},order: [['createdAt', 'DESC']]});
  };
  const getAllEventConfigsPending = async () => {
    return await EventConfig.findAll({where:{status:false}});
  };

  const getAllEventConfigsPendingByBranch = async (branch) => {
    return await EventConfig.findAll({where:{status:false,branch:branch}});
  };
  
  const approve = async (id) => {
    const updatedEventConfig = await EventConfig.update({status:true}, {
      where: { _id: id },returning:true
    });
    return updatedEventConfig[1][0];
  };

  const updateEventConfig = async (id, eventConfig) => {
    const updatedEventConfig = await EventConfig.update({eventConfig}, {
      where: { _id: id },
    });
    return updatedEventConfig;
  };
  
  const deleteEventConfig = async (id) => {
    const deletedEventConfig = await EventConfig.destroy({
      where: { _id: id },
    });
    return deletedEventConfig;
  };





  
  module.exports = {
    createEventConfig,
    getEventConfigById,
    getAllEventConfigs,
    updateEventConfig,
    deleteEventConfig,
    getAllEventConfigsActive,
    approve,
    getAllEventConfigsPending,
    getAllEventConfigsPendingByBranch,
    getAllEventConfigsActiveBybranch


  }