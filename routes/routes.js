const router = require("express").Router();

//
router.use("/items", require("./itemRoutes"));
router.use("/warehouse", require("./warehouseRoutes"));
router.use("/transactions", require("./transactionRoutes")  );
router.use("/suppliers", require("./supplierRoutes")  );
router.use("/users", require("./userRoutes")  );
router.use("/", require("./authRoutes")  );

module.exports = router;