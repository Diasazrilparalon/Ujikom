const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const Item = require('./Item');
const Supplier = require('./Supplier');
const User = require('./User');
const Warehouse = require('./Warehouse');

const Transaction = sequelize.define('Transaction', {
  id_transaksi: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  id_barang: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: Item, key: 'id_barang' }, 
    onDelete: 'CASCADE'
  },
  id_gudang: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: Warehouse, key: 'id_gudang' }, 
    onDelete: 'CASCADE'
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
    references: { model: Supplier, key: 'id_supplier' }, 
    onDelete: 'SET NULL'
  },
  konsumen: { 
    type: DataTypes.STRING, 
    allowNull: true  
  },
  id_user: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: { model: User, key: 'id_user' }, 
    onDelete: 'CASCADE'
  },
  tanggal: { 
    type: DataTypes.DATE,  
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
  
}, { 
  tableName: 'transactions', 
  timestamps: false 
});

// Hubungan dengan model lain
Transaction.belongsTo(Item, { foreignKey: 'id_barang' });
Item.hasMany(Transaction, { foreignKey: 'id_barang' });

Transaction.belongsTo(Warehouse, { foreignKey: 'id_gudang' });
Warehouse.hasMany(Transaction, { foreignKey: 'id_gudang' });

Transaction.belongsTo(Supplier, { foreignKey: 'id_supplier' });
Supplier.hasMany(Transaction, { foreignKey: 'id_supplier' });

Transaction.belongsTo(User, { foreignKey: 'id_user' });
User.hasMany(Transaction, { foreignKey: 'id_user' });

module.exports = Transaction;
