const express = require("express");
const { performOperation } = require("../controllers/arithmeticController");

const router = express.Router();

router.post("/arithmetic", performOperation);

module.exports = router;
