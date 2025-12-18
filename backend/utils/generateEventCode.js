const crypto = require("crypto");

module.exports = () =>
  "EVT-" + crypto.randomBytes(3).toString("hex").toUpperCase();
