const httpStatus = require("http-status");
const { restart } = require("pm2");
const { createLineItems } = require("../services/ledger.service");

const getLedger = async (req, res) => {
  try {
    const lineItems = createLineItems(req.query);
    res.status(httpStatus.OK).send({
      data: lineItems,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  getLedger,
};
