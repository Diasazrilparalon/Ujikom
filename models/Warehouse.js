const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Warehouse = sequelize.define('Warehouse', {
  id_gudang: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nama_gudang: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lokasi: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { tableName: 'warehouses', timestamps: false });

module.exports = Warehouse;
