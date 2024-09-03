const { Sequelize } = require('sequelize');
const General = require('../models/General');


// Create a new General record
async function createGeneral(generalData) {
    const general = await General.create(generalData);
    return general.toJSON();
  }
  
  // Retrieve a single General record by ID
  async function getGeneralById(generalId) {
    const general = await General.findByPk(generalId);
    return general ? general.toJSON() : null;
  }
  
  // Retrieve all General records
  async function getAllGenerals() {
    const generals = await General.findAll();
    return generals.map(general => general.toJSON());
  }
  
  // Update a General record by ID
  async function updateGeneralById(generalId, generalData) {
    console.log("🚀 ~ file: general-repo.js:25 ~ updateGeneralById ~ generalId:", generalId)
    console.log("🚀 ~ file: general-repo.js:25 ~ updateGeneralById ~ generalData:", generalData)
    
    const [numRows, [updatedGeneral]] = await General.update(generalData, {
      where: { _id: generalId },
      returning: true,
    });
    return numRows === 1 ? updatedGeneral.toJSON() : null;
  }

  async function approveGeneralById(generalId, generalData) {
    const [numRows, [updatedGeneral]] = await General.update(generalData, {
      where: { _id: generalId },
      returning: true,
    });
    return numRows === 1 ? updatedGeneral.toJSON() : null;
  }
  
  // Delete a General record by ID
  async function deleteGeneralById(generalId) {
    const numRows = await General.destroy({ where: { _id: generalId } });
    return numRows === 1;
  }
  

  module.exports = {
    createGeneral,
    getGeneralById,
    getAllGenerals,
    updateGeneralById,
    deleteGeneralById,
    approveGeneralById
  };
  