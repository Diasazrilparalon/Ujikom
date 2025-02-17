const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/routes');
const cookieParser= require('cookie-parser')
const suppliers = require ('./models/Supplier')
const User = require ('./models/User')
const transactions = require('./models/Transaction');
const stock = require('./models/Stock');
const Warehouse = require('./models/Warehouse')
const Item = require('./models/Item');
const Stock = require('./models/Stock');
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Ubah menjadi URL frontend
    credentials: true, // Izinkan cookie dikirim
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' })); // Sesuaikan origin dengan frontend

// Routes
app.use('/api', authRoutes);

// Sync database
sequelize.authenticate()
  .then(async () => {
    console.log('Connection success');
    await Stock.sync({ alter: true });
   
  })
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
