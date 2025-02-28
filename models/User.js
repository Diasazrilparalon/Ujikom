const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Transaction = require('../models/Transaction')
const User = sequelize.define('User', {
  id_user: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  username: { 
    type: DataTypes.STRING, 
    allowNull: false,
    unique: true 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true,
    validate: { isEmail: true }
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  role: { 
    type: DataTypes.ENUM('Admin', 'Staff','Owner'), 
    allowNull: false 
  }
}, { tableName: 'users', timestamps: false });

module.exports = User;
