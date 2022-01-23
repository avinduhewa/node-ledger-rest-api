const BaseJoi = require("joi");
const JoiTimezone = require("joi-tz");
const Joi = BaseJoi.extend(JoiTimezone);

const { WEEKLY, FORTNIGHTLY, MONTHLY } = require("../config/constants");

const getLedger = {
  query: Joi.object().keys({
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().min(Joi.ref("start_date")).required(),
    frequency: Joi.string()
      .valid(WEEKLY, FORTNIGHTLY, MONTHLY)
      .insensitive()
      .required(),
    weekly_rent: Joi.number().min(1).required(),
    timezone: Joi.timezone().required(),
  }),
};

module.exports = {
  getLedger,
};
