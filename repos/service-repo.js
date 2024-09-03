const Services = require('../models/Services');
const {Sequelize,fn} = require("sequelize")

// Create
const createService = async (name, status) => {
  try {
    const service = await Services.create({
      name:name,
      status:status,
    });
    return service;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to create service');
  }
};

// Read
const getServiceById = async (id) => {
  try {
    const service = await Services.findByPk(id);
    if (!service) throw new Error('Service not found');
    return service;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to get service');
  }
};

const getAllServices = async () => {
  try {
    // const services = await Services.findAll();
    // return services;
    const services = await Services.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('name')), 'name']],
    });
    return services;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to get services');
  }
};

// Update
const updateService = async (id, name, status) => {
  try {

    const updatedService = await Services.update({
      name:name,
      status:status,
    },{where:{_id:id},returning:true});
    return updatedService[1][0];
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
const approve = async (id, status) => {
  try {
    
    const updatedService = await Services.update({
      status:status,
    },{where:{_id:id},returning:true});
    return updatedService[1][0];
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
const unapprove = async (id, status) => {
  try {
    
    const updatedService = await Services.update({
      status:status,
    },{where:{_id:id},returning:true});
    return updatedService[1][0];
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

// Delete
const deleteService = async (id) => {
  try {
    await Services.destroy();
    return true;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

module.exports = {
  createService,
  getServiceById,
  getAllServices,
  updateService,
  deleteService,
  approve,
  unapprove
};
