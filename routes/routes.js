const router = require("express").Router();

//
router.use("/", require("./itemRoutes"));
router.use("/transactions", require("./transactionRoutes")  );
router.use("/", require("./supplierRoutes")  );
router.use("/", require("./userRoutes")  );
router.use("/", require("./authRoutes")  );
module.exports = router;