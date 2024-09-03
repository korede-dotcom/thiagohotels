const serviceRepo = require('../repos/service-repo');

// Create
const createService = async (req, res, next) => {
  const { name, status } = req.body;
  try {
    if (req.user.role_id === 1) {
        const service = await serviceRepo.createService(name, true);
        res.status(201).json(service);
        
    } else {
        const service = await serviceRepo.createService(name, false);
        res.status(201).json(service);
    }
  } catch (err) {
    throw new Error(err)
  }
};

// Read
const getServiceById = async (req, res, next) => {
  const { id } = req.query;
  try {
    const service = await serviceRepo.getServiceById(id);
    res.json({
        status:true,
        data:{
            service
        }
    });
  } catch (err) {
    throw new Error(err)
  }
};

const getAllServices = async (req, res, next) => {
  try {
    const services = await serviceRepo.getAllServices();
    res.json({
        status:true,
        data:{
            services
        }
    });
  } catch (err) {
    throw new Error(err)
  }
};

// Update
const updateService = async (req, res, next) => {
  const { id } = req.query;
  const { name, status } = req.body;

  try {
    if (req.user.role_id === 1 ) {
        const updatedService = await serviceRepo.updateService(id, name, true);
        res.json({
            status:true,
            data:{
                updatedService
            }
        });

        
    }else{
        const updatedService = await serviceRepo.updateService(id, name, false);
        res.json({
            status:true,
            data:{
                updatedService
            }
        });
    }
  } catch (err) {
    throw new Error(err)
  }
};


const approve = async (req, res, next) => {
  const  id  = req.query.id;
 

  try {
    const updatedService = await serviceRepo.approve(id,true);
    res.json({
        status:true,
        data:{
            updatedService
        }
    });
  } catch (err) {
    throw new Error(err)
  }
};
const unapprove = async (req, res, next) => {
  const  id  = req.query.id;
 

  try {
    const updatedService = await serviceRepo.unapprove(id,false);
    res.json({
        status:true,
        data:{
            updatedService
        }
    });
  } catch (err) {
    throw new Error(err)
  }
};

// Delete
const deleteService = async (req, res, next) => {
  const id  = req.query.id;
  try {
    await serviceRepo.deleteService(id);
    res.json({
        status:true
    });
  } catch (err) {
    throw new Error(err)
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
