const express = require('express');
const router = express.Router();

router.use("/lobby", require("./lobby"));
router.use("/player", require("./player"));

module.exports = router;