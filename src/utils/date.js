const moment = require("moment-timezone");

const { MONTHS, DAYS } = require("../config/constants");

/**
 * Get the next month date from current date.
 * @param {Date} currentDate - Start date of the ledger
 * @returns {Object}
 */
const getNextMonth = (currentDate) => {
  let currentMonthStart = moment(currentDate).startOf(MONTHS);
  let currentMonthEnd = moment(currentDate).endOf(MONTHS);
  const isFirstOfMonth = currentDate.date() == currentMonthStart.date();
  const isEndOfMonth = currentDate.date() == currentMonthEnd.date();
  let futureMonth = moment(currentDate).add(1, MONTHS);

  if (isFirstOfMonth) futureMonth = moment(currentDate);
  if (isFirstOfMonth || isEndOfMonth) {
    futureMonth
      .endOf(MONTHS)
      .utc(0)
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  }

  return futureMonth;
};

const removeFromDate = (date, number = 0) => {
  return moment(date).subtract(number, DAYS);
};

const getDayDifference = (fromDate, toDate, includeCurrent = true) => {
  const number = toDate.diff(
    includeCurrent ? removeFromDate(fromDate, 1) : fromDate,
    DAYS
  );

  return number;
};

const getDate = (date) => {
  return moment(date).format("YYYY-MM-DD");
};

module.exports = {
  getNextMonth,
  removeFromDate,
  getDayDifference,
  getDate,
};
