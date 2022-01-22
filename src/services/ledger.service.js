const moment = require("moment-timezone");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const {
  WEEKLY,
  FORTNIGHTLY,
  MONTHLY,
  DAYS,
  MONTHS,
} = require("../config/constants");

/**
 * Get Updated End Date
 * @param {Date} date - Date object
 * @param {string} frequency - Payment frequency of the ledger
 * @returns {Date}
 */
const getUpdatedEndDate = (date, frequency) => {
  let endDate;
  if (frequency === WEEKLY) {
    endDate = date.add(7, DAYS);
  } else if (frequency === FORTNIGHTLY) {
    endDate = date.add(14, DAYS);
  } else if (frequency === MONTHLY) {
    endDate = date.add(1, MONTHS);
  }
  return endDate;
};

/**
 * Get Rent Amount
 * @param {number} weeklyRent - The weekly amount of the ledger
 * @param {string} frequency - Payment frequency of the ledger
 * @param {number} numberOfDays - If duration is less than frequency use custom number
 * @returns {number}
 */
const getRentAmount = (weeklyRent, frequency, numberOfDays = 0) => {
  let amount = weeklyRent;
  if (numberOfDays) {
    amount = (weeklyRent / 7) * numberOfDays;
  } else if (frequency === FORTNIGHTLY) {
    amount = weeklyRent * 2;
  } else if (frequency === MONTHLY) {
    amount = ((weeklyRent / 7) * 365) / 12;
  }
  return parseFloat(amount.toFixed(2), 10);
};

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
    let endDate = getUpdatedEndDate(start, frequency);
    let numberOfDays = 0;

    if (endDate > end) {
      numberOfDays = start.diff(end, DAYS);
    }

    lineItems.push({
      start_date: start.toISOString(),
      end_data: endDate.toISOString(),
      amount: getRentAmount(weekly_rent, frequency, numberOfDays),
    });
    start = endDate;
  }
  return lineItems;
};

module.exports = {
  createLineItems,
};
