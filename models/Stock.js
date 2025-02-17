const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Item = require('./Item');
const Warehouse = require('./Warehouse');

const Stock = sequelize.define('Stock', {
  id_stock: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_barang: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Item, key: 'id_barang' }, // Pastikan relasi ke Item benar
    onDelete: 'CASCADE'
  },
  id_gudang: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Warehouse, key: 'id_gudang' },
    onDelete: 'CASCADE'
  },
  jumlah_stok: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, { tableName: 'stocks', timestamps: false });

// Hubungkan Stock ke Item dan Warehouse
Stock.belongsTo(Item, { foreignKey: 'id_barang' });
Stock.belongsTo(Warehouse, { foreignKey: 'id_gudang' });

Item.hasMany(Stock, { foreignKey: 'id_barang' }); // Tambahkan hubungan ke Item

module.exports = Stock;
