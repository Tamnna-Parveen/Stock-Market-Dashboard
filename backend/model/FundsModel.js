const { model } = require("mongoose");
const FundsSchema = require('../schema/FundsSchema');
const FundsModel = model("funds", FundsSchema);
module.exports = FundsModel;
