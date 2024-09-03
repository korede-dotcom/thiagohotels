const {Sequelize,DataTypes} = require('sequelize');
const connectDb = require("../config/connectDB");
const sequelize = connectDb;
const bcrypt = require('bcryptjs');
// const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/postgres');
const User = sequelize.define('user', {
    _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        foreignKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    verified:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    roleName: {
        type: DataTypes.STRING,
        
     
    
      }
},{
    hooks:{
        beforeCreate: async (user, options) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);   
                switch (user.role_id) {
                  case 1:
                    user.roleName = "ceo";
                    break;
                  case 2:
                    user.roleName = "eventmanager";
                    break;
                  case 3:
                    user.roleName = "gymmanager";
                    break;
                  case 4:
                    user.roleName = "hotelmanager";
                    break;
                  case 5:
                    user.roleName = "secretary";
                    break;
                  case 6:
                    user.roleName = "staffs";
                    break;
                  case 7:
                    user.roleName = "hotel receptionist";
                    break;
                  case 8:
                    user.roleName = "gym receptionist";
                    break;
                  case 9:
                    user.roleName = "event receptionist";
                    break;
                  default:
                    break;
                }
         
        },
    
        
    },
    
}
);


User.sync({})

module.exports = User;


    // add a new field to the schema
    // this field will be used to store the user's cart