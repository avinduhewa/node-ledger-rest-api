const { createLineItems } = require("../services/ledger.service");
const catchAsync = require("../utils/catchAsync");

const getLedger = catchAsync(async (req, res, next) => {
  try {
    const lineItems = createLineItems(req.query);
    res.status(200).send({
      data: lineItems,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  getLedger,
};
