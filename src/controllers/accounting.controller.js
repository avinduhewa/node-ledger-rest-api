const { createLineItems } = require("../services/ledger.service");
const catchAsync = require("../utils/catchAsync");

const getLedger = catchAsync(async (req, res) => {
  const lineItems = createLineItems(req.query);
  res.send(lineItems);
});

module.exports = {
  getLedger,
};
