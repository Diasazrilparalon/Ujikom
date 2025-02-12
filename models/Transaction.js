const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Item = require('./Item');
const Supplier = require('./Supplier');
const User = require('./User');
const Stock = require('./Stock');

const Transaction = sequelize.define('Transaction', {
  id_transaksi: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  id_barang: { 
    type: DataTypes.INTEGER, 
    allowNull: false ,
    onDelete: 'SET NULL' // Jika barang dihapus, transaksi tetap ada
  },
  tipe_transaksi: { 
    type: DataTypes.ENUM('Masuk', 'Keluar'), 
    allowNull: false 
  },
  jumlah: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  id_supplier: { 
    type: DataTypes.INTEGER, 
    allowNull: true,  
    references: { model: Supplier, key: 'id_supplier' }
  },
  konsumen: { 
    type: DataTypes.STRING, 
    allowNull: true  
  },
  id_user: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: { model: User, key: 'id_user' }
  }, tanggal_transaksi: { 
    type: DataTypes.DATE, 
    allowNull: false, 
    defaultValue: DataTypes.NOW // Menyimpan waktu transaksi secara otomatis
  }

}, { tableName: 'transactions', timestamps: false });

Transaction.belongsTo(Item, { foreignKey: 'id_barang' });
Item.hasMany(Transaction, { foreignKey: 'id_barang' });

Transaction.belongsTo(Supplier, { foreignKey: 'id_supplier' });
Supplier.hasMany(Transaction, { foreignKey: 'id_supplier' });

Transaction.belongsTo(User, { foreignKey: 'id_user' });
User.hasMany(Transaction, { foreignKey: 'id_user' });

module.exports = Transaction;
