const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Item = require("./Item")
const Supplier = sequelize.define('Supplier', {
  id_supplier: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  nama_supplier: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  kontak_supplier: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  alamat: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  }
}, { tableName: 'suppliers', timestamps: false });
Item.belongsTo(Supplier, { foreignKey: 'id_supplier' });
Supplier.hasMany(Item, { foreignKey: 'id_supplier' });
module.exports = Supplier;
