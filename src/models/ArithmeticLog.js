const mongoose = require("mongoose");

const ArithmeticLogSchema = new mongoose.Schema({
  operation: { type: String, required: true },
  inputs: { type: Object, required: true },
  result: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  responseTime: { type: Number, required: true },
});

module.exports = mongoose.model("ArithmeticLog", ArithmeticLogSchema);
