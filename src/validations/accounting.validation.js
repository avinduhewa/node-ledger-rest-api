const BaseJoi = require("joi");
const JoiTimezone = require("joi-tz");
const Joi = BaseJoi.extend(JoiTimezone);

const { WEEKLY, FORTNIGHTLY, MONTHLY } = require("../config/constants");

const getLedger = {
  query: Joi.object().keys({
    start_date: Joi.date().iso(),
    end_date: Joi.date().iso().min(Joi.ref("start_date")),
    frequency: Joi.string().valid(WEEKLY, FORTNIGHTLY, MONTHLY).insensitive(),
    weekly_rent: Joi.number().min(1),
    timezone: Joi.timezone().required(),
  }),
};

module.exports = {
  getLedger,
};
