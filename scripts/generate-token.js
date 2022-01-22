const jwt = require("jsonwebtoken");
require("dotenv").config();

const token = jwt.sign(
  { email: "admin@email.com", role: "admin" },
  process.env.TOKEN_KEY
);

console.log("GENERATED TOKEN: ", token);
