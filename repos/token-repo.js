const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require("../models/User")
const Manager = require("../models/Manager")
const ResetPassword = require("../models/ResetPassword")
const crypto = require("crypto")
const sendSMS = require("../utils/Sms")
const bcrypt = require("bcryptjs")
const {Op} = require("sequelize")

const signToken = async (data) => {
    if (data.role_id === 1) {
        return jwt.sign({ _id: data?._id,role_id:data.role_id,name:data.name,roleName:data.roleName,branch:false}, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
        
    } else {
        const manager = await Manager.findOne({where:{user_id:data._id}})
        return jwt.sign({ _id: data._id,role_id:data.role_id,name:data.name,roleName:data.roleName,branch:manager.dataValues.branch_id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });
    }
};

const createSendToken = async (user, statusCode, res) => {
  console.log("🚀 ~ file: token-repo.js:26 ~ createSendToken ~ user:", user)
  const token = await signToken(user);

  // Remove the password field from the user object
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
};

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
        status: false,
      message: 'You are not logged in! Please log in to get access.',
    });
  }

  try {
    const decoded = await verifyToken(token);
    const user = await User.findOne({ where: { _id: decoded._id } });


    if (!user) {
      return res.status(401).json({
        status: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      status: false,
      message: 'Invalid token!',
      sta:err.stack
    });
  }
};


const sendResetPasswordToken = async (email) => {
   try {
       User.belongsTo(Manager,{foreignKey:"_id"})

     const user = await User.findOne({ where: { email } });
     const manager = await Manager.findOne({where:{user_id:user._id}})
 
     if (!user) {
      throw new Error('User not found.');
     }
 
     const token = crypto.randomBytes(6).toString('hex');
     const send = await sendSMS(manager.phonenumber,`here is your opt: ${token}`)
 
     return await ResetPassword.create({ user_id: user._id, token:token });
    
   } catch (error) {
        throw new Error(error)
   }
      
    
}

const changePassword = async (token,password) =>  {
    const resetPassword = await ResetPassword.findOne({
       where: {
         token: token,
         expiresAt: { [Op.gt]: new Date() } // Op is Sequelize operator
       }
     });
     
     if (!resetPassword) {
       throw new Error('invalid otp')
     }
     const hashedPassword = await bcrypt.hash(password, 10);
     const updated = await User.update({ password: hashedPassword }, { where: { _id: resetPassword.user_id },returning:true });
     await ResetPassword.destroy({ where: { user_id: resetPassword.user_id } });
     return updated[1][0]

}


module.exports = { createSendToken, protect,sendResetPasswordToken,changePassword };
