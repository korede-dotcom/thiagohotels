const Branch = require('../models/Branch');
const Images = require('../models/Images');

const createBranch = async (data) => {
  try {
    const branch = await Branch.create({...data});
    return branch;
  } catch (error) {
    throw new Error(error);
  }
};

const getBranchById = async (id) => {
  try {
    const branch = await Branch.findByPk(id);
    return branch;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllBranches = async () => {
  try {
    const branches = await Branch.findAll({order: [['createdAt', 'DESC']]});
    return branches;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllActiveBranches = async () => {
  try {
    Branch.belongsTo(Images,{foreignKey:"_id"})
    const branches = await Branch.findAll({where:{status:true},include:[{model:Images}]});
    return branches;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllPendingBranches = async () => {
  try {
    const branches = await Branch.findAll({where:{status:true},order: [['createdAt', 'DESC']]});
    return branches;
  } catch (error) {
    throw new Error(error);
  }
};

const updateBranchById = async (id, data) => {
  try {
    const branch = await Branch.findByPk(id);
    if (!branch) {
      return null;
    }
    const updatedBranch = await branch.update(data);
    return updatedBranch;
  } catch (error) {
    throw new Error(error);
  }
};

const approveBranchById = async (id) => {
  try {
    const branch = await Branch.findByPk(id);
    if (!branch) {
      return null;
    }
    const updatedBranch = await branch.update({status:true});
    return updatedBranch;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteBranchById = async (id) => {
  try {
    const branch = await Branch.findByPk(id);
    if (!branch) {
      return null;
    }
    await branch.destroy();
    return branch;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createBranch,
  getBranchById,
  getAllBranches,
  updateBranchById,
  deleteBranchById,
  approveBranchById,
  getAllActiveBranches,
  getAllPendingBranches
};
