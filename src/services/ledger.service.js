const moment = require("moment-timezone");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const {
  WEEKLY,
  FORTNIGHTLY,
  MONTHLY,
  DAYS,
  CUSTOM,
} = require("../config/constants");
const logger = require("../config/logger");
const { getNextMonth, getDayDifference, getDate } = require("../utils/date");

const F = [WEEKLY, FORTNIGHTLY, MONTHLY];

const formatAmount = (amount) => {
  return Math.round(amount * 100) / 100;
};

const formatDate = (date) => {
  return date.toISOString();
};

const getNextPaymentFrequencyDate = {
  [WEEKLY]: (date) => date.add(6, DAYS),
  [FORTNIGHTLY]: (date) => date.add(13, DAYS),
  [MONTHLY]: (currentDate) => getNextMonth(currentDate),
};

const calculateRent = {
  [WEEKLY]: (rent) => formatAmount(rent),
  [FORTNIGHTLY]: (rent) => formatAmount(rent * 2),
  [MONTHLY]: (rent) => formatAmount(((rent / 7) * 365) / 12),
  [CUSTOM]: (rent, numberOfDays) => formatAmount((rent / 7) * numberOfDays),
};

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
    moment.tz.setDefault(timezone);
    let start = moment(start_date);
    const end = moment(end_date);

    const lineItems = [];

    if (!frequency || !F.includes(frequency)) {
      logger.error("Frequency is invalid");
      throw new Error(httpStatus.BAD_REQUEST, "Frequency is invalid");
    }

    if (!weekly_rent || isNaN(weekly_rent) || weekly_rent <= 0) {
      logger.error("Weekly Rent is invalid");
      throw new Error(httpStatus.BAD_REQUEST, "Weekly Rent is invalid");
    }

    // loop through the duration of the lease
    let id = 1;
    while (start < end) {
      let endDate = getNextPaymentFrequencyDate[frequency](moment(start));
      let amount = calculateRent[frequency](weekly_rent);

      // Get custom duration if endDate is greater than the end of lease
      if (getDate(endDate) > getDate(end)) {
        const numberOfDays = getDayDifference(start, end);
        amount = calculateRent[CUSTOM](weekly_rent, numberOfDays);
        endDate = end;
      }

      lineItems.push({
        id, // added to easily identify line items
        start_date: formatDate(start),
        end_date: formatDate(endDate),
        amount,
      });

      // shift starting day to the following day/month
      start = endDate.add(1, DAYS);
      id += 1;
    }
    return lineItems;
  } catch (err) {
    throw new ApiError(err.statusCode, err.message);
  }
};

module.exports = {
  getNextPaymentFrequencyDate,
  calculateRent,
  createLineItems,
};
