const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema(
  {
    refreshtoken: {
      type: String,
      unique: true,
      required: true,
    },
    "expireAt": { type: Date, expires: 10 },
  }
  //{ timeseries: true }
);

refreshTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 10 });

const RTdb = mongoose.model("RTdb", refreshTokenSchema);

module.exports = RTdb;
