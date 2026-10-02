const { model } = require("mongoose");
const GTTSchema = require('../schema/GTTSchema');
const GTTModel = model("gtt", GTTSchema);
module.exports = GTTModel;
