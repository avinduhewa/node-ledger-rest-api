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
const logger = require("../config/logger");

const F = [WEEKLY, FORTNIGHTLY, MONTHLY];

const formatAmount = (amount) => {
  return Math.round(amount * 100) / 100;
};

const getUpdatedEndDate = {
  [WEEKLY]: (date) => date.add(6, DAYS),
  [FORTNIGHTLY]: (date) => date.add(13, DAYS),
  [MONTHLY]: (date) => date.add(1, MONTHS),
};

const getRentAmount = {
  [WEEKLY]: (rent) => formatAmount(rent),
  [FORTNIGHTLY]: (rent) => formatAmount(rent * 2),
  [MONTHLY]: (rent) => formatAmount(((rent / 7) * 365) / 12),
  [CUSTOM]: (rent, numberOfDays) => formatAmount((rent / 7) * numberOfDays),
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
  amount,
});

/**
 * Create Line Items
 * @param {Object} params - Query params
 * @param {string} [params.start_date] - Start date of the ledger
 * @param {string} [params.end_date] - The end date of the ledger
 * @param {string} [params.frequency] - Payment frequency of the ledger
 * @param {number} [params.weeklyRent] - The weekly amount of the ledger
 * @param {string} [params.timezone] - The timezone of the property
 * @returns {Array{Object}}
 */
const createLineItems = ({
  start_date,
  end_date,
  frequency,
  weekly_rent,
  timezone,
}) => {
  try {
    // Set timezone
    moment.tz(timezone).format();
    let start = moment(start_date);
    const end = moment(end_date);

    const lineItems = [];

    if (!frequency || !F.includes(frequency)) {
      logger.error("Frequency is invalid");
      throw new ApiError(httpStatus.BAD_REQUEST, "Frequency is invalid");
    }

    if (!weekly_rent || isNaN(weekly_rent) || weekly_rent <= 0) {
      logger.error("Weekly Rent is invalid");
      throw new ApiError(httpStatus.BAD_REQUEST, "Weekly Rent is invalid");
    }

    // loop through the duration of the lease
    while (start < end) {
      let endDate = getUpdatedEndDate[frequency](moment(start));

      let rent = getRentAmount[frequency](weekly_rent);

      // Get custom duration if endDate is greater than the end of lease
      if (endDate > end) {
        const numberOfDays = end.diff(
          // reduce one day to include current date
          moment(start).subtract(1, DAYS),
          DAYS
        );
        rent = getRentAmount[CUSTOM](weekly_rent, numberOfDays);
        endDate = end;
      }

      lineItems.push(createLineItem(start, endDate, rent));

      // shift starting day to the following day/month
      start = endDate.add(1, frequency === MONTHLY ? MONTHLY : DAYS);
    }
    return lineItems;
  } catch (err) {
    throw new ApiError(err.status, err.message);
  }
};

module.exports = {
  getUpdatedEndDate,
  getRentAmount,
  createLineItems,
};
