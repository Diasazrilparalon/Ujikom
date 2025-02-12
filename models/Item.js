const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Item = sequelize.define('Item', {
  id_barang: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  nama_barang: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  kategori: { 
    type: DataTypes.ENUM('Elektronik', 'Furniture', 'Lainnya'), 
    allowNull: false 
  },
  batas_minimum: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  }
}, { tableName: 'items', timestamps: false });

module.exports = Item;
