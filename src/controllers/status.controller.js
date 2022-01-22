const catchAsync = require("../utils/catchAsync");

const getStatus = catchAsync(async (req, res) => {
  const status = {
    date: new Date().toString(),
    message: "Ledger API is running",
  };
  res.send(status);
});

module.exports = {
  getStatus,
};
