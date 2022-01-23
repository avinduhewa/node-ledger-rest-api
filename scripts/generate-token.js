const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = () => {
  let token = jwt.sign(
    { email: "admin@email.com", role: "admin" },
    process.env.TOKEN_KEY
  );

  console.log("GENERATED TOKEN: ", token);

  return token;
};

generateToken(); // call token generation

module.exports = {
  generateToken,
};
