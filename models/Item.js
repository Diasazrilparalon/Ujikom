const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Supplier = require('./Supplier'); // Pastikan menggunakan './Supplier', bukan '../models/Supplier'

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
  },
  id_supplier: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Supplier, key: 'id_supplier' }, // Perbaiki referensi ke Supplier
    onDelete: 'CASCADE'
  }
}, { tableName: 'items', timestamps: false }); // Perbaiki nama tabel menjadi 'items'

Item.belongsTo(Supplier, { foreignKey: 'id_supplier' }); // Item memiliki Supplier
Supplier.hasMany(Item, { foreignKey: 'id_supplier' }); // Supplier bisa punya banyak Item

module.exports = Item;
