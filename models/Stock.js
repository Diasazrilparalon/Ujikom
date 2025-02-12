const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Item = require('./Item');

const Stock = sequelize.define('Stock', {
  id_stock: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_barang: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Item, key: 'id_barang' }
  },
  jumlah_stok: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  lokasi_gudang: {  // Opsional, jika ada multi-gudang
    type: DataTypes.STRING,
    allowNull: true
  }
}, { tableName: 'stocks', timestamps: false });

Stock.belongsTo(Item, { foreignKey: 'id_barang' });
Item.hasMany(Stock, { foreignKey: 'id_barang' });

module.exports = Stock;
