const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require("../models/User")
const Manager = require("../models/Manager")
const ResetPassword = require("../models/ResetPassword")
const crypto = require("crypto")
const sendSMS = require("../utils/Sms")
const bcrypt = require("bcryptjs")
const {Op} = require("sequelize");
const Staff = require('../models/Staff');
const SendEmail = require('../utils/sendEmail');

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

     const user = await User.findOne({ where: { email:email } });
     console.log("🚀 ~ sendResetPasswordToken ~ user:", user)
     const manager = await Staff.findOne({where:{user_id:user._id}})
     console.log("🚀 ~ sendResetPasswordToken ~ manager:", manager)
 
     if (!user) {
      throw new Error('User not found.');
     }
 
     const token = crypto.randomBytes(6).toString('hex');
    //  const send = await sendSMS(manager.phonenumber,`here is your opt: ${token}`)
    const sendEmail = await SendEmail(
      "Password Reset",
      `Here is your OTP: ${token}`,
      `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
              <tr>
                <td align="center" style="background-color: #94081a; padding: 20px;">
                  <h2 style="color: #ffffff; font-size: 24px; margin: 0;">Password Reset Request</h2>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; color: #333;">
                  <p style="font-size: 16px; margin-bottom: 20px;">Dear ${user.name},</p>
                  <p style="font-size: 16px; margin-bottom: 20px;">You requested a password reset for your account.</p>
                  <p style="font-size: 16px; margin-top: 20px;">reset your password via a link, please click the button below:</p>
                  <div style="text-align: center; margin: 20px 0;">
                    <a href="https://thiagohotelandsuites/portal/recovery?id=${token}" style="display: inline-block; padding: 12px 24px; background-color: #94081a; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px;">Reset Password</a>
                  </div>
                  <p style="font-size: 16px; margin-top: 20px;">this link expires in five minutes</p>
                  <p style="font-size: 16px; margin-top: 20px;">If you didn’t request this, please ignore this email.</p>
                </td>
              </tr>
              <tr>
                <td align="center" style="background-color: #f4f4f4; padding: 20px; color: #666; font-size: 14px;">
                  <p style="margin: 0;">Best regards,</p>
                  <p style="margin: 5px 0 0;">Thiago Hotel and Suites</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      `,
      user.email,
      "thiagohotelandsuites@gmail.com"
    );
    
    
  
  
     console.log("🚀 ~ sendResetPasswordToken ~ sendEmail:", sendEmail)
 
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
       throw new Error('Link expired')
     }
     const hashedPassword = await bcrypt.hash(password, 10);
     const updated = await User.update({ password: hashedPassword }, { where: { _id: resetPassword.user_id },returning:true });
     await ResetPassword.destroy({ where: { user_id: resetPassword.user_id } });
     return updated[1][0]

}


module.exports = { createSendToken, protect,sendResetPasswordToken,changePassword };
