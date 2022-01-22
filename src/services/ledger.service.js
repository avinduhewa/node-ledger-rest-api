const moment = require("moment-timezone");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const {
  WEEKLY,
  FORTNIGHTLY,
  MONTHLY,
  DAYS,
  MONTHS,
  CUSTOM,
} = require("../config/constants");

const getUpdatedEndDate = {
  [WEEKLY]: (date) => date.add(7, DAYS),
  [FORTNIGHTLY]: (date) => date.add(14, DAYS),
  [MONTHLY]: (date) => date.add(1, MONTHS),
};

const getRentAmount = {
  [WEEKLY]: (rent) => rent,
  [FORTNIGHTLY]: (rent) => rent * 2,
  [MONTHLY]: (rent) => ((rent / 7) * 365) / 12,
  [CUSTOM]: (rent, numberOfDays) => (rent / 7) * numberOfDays,
};

/**
 * Create Line Items
 * @param {string} start - Start date of the ledger
 * @param {string} end - The end date of the ledger
 * @param {number} amount - The rent amount
 * @returns {Object}
 */
const createLineItem = (start, end, amount) => ({
  start_date: start.toISOString(),
  end_date: end.toISOString(),
  amount: parseFloat(amount.toFixed(2)),
});

/**
 * Create Line Items
 * @param {Object} options - Query options
 * @param {string} [options.start_date] - Start date of the ledger
 * @param {string} [options.end_date] - The end date of the ledger
 * @param {string} [options.frequency] - Payment frequency of the ledger
 * @param {number} [options.weeklyRent] - The weekly amount of the ledger
 * @param {string} [options.timezone] - The timezone of the property
 * @returns {Array{Object}}
 */
const createLineItems = ({
  start_date,
  end_date,
  frequency,
  weekly_rent,
  timezone,
}) => {
  // Set timezone
  moment.tz(timezone).format();
  let start = moment(start_date);
  const end = moment(end_date);

  const lineItems = [];
  while (start < end) {
    let endDate = getUpdatedEndDate[frequency](moment(start));

    let rent = getRentAmount[frequency](weekly_rent);

    // Get custom duration if endDate is greater than the end of lease
    if (endDate > end) {
      const numberOfDays = end.diff(start, DAYS);
      rent = getRentAmount[CUSTOM](weekly_rent, numberOfDays);
      endDate = end;
    }

    lineItems.push(createLineItem(start, endDate, rent));

    start = endDate;
  }
  return lineItems;
};

module.exports = {
  createLineItems,
};
