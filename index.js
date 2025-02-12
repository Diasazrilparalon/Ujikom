const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/routes');
const suppliers = require ('./models/Supplier')
const User = require ('./models/User')
const transactions = require('./models/Transaction');
const stock = require('./models/Stock');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', authRoutes);

// Sync database
sequelize.authenticate()
  .then(async () => {
    console.log('Connection success');
    // await sequelize.sync({ alter: true });
   
  })
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
