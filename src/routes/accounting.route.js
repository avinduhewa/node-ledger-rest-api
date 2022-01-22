const express = require("express");
const validate = require("../middlewares/validate");
const accountingValidation = require("../validations/accounting.validation");
const accountingController = require("../controllers/accounting.controller");
const authorize = require("../middlewares/auth");

const router = express.Router();
router.use(authorize);

router
  .route("/ledger")
  .get(
    validate(accountingValidation.getLedger),
    accountingController.getLedger
  );

module.exports = router;

/**
 * @swagger
 * /accounting/ledger:
 *   get:
 *     summary: Get accounting ledger for a given lease
 *     description: Generate a ledger based on parameters
 *     tags: [Accounting]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start_date
 *         required: true
 *         schema:
 *           type: string
 *           default: 2022-01-22T07:28:10+0000
 *         description: Start date of the ledger - provided in ISO String
 *       - in: query
 *         name: end_date
 *         required: true
 *         schema:
 *           type: string
 *           default: 2022-02-22T07:28:10+0000
 *         description: The end date of the ledger - provided in ISO String
 *       - in: query
 *         name: frequency
 *         required: true
 *         schema:
 *           type: string
 *           default: WEEKLY
 *         description: Payment frequency of the ledger - provided as a string
 *       - in: query
 *         name: weekly_rent
 *         required: true
 *         schema:
 *           type: number
 *           default: 400
 *         description: The weekly amount of the ledger - provided as a number
 *       - in: query
 *         name: timezone
 *         required: true
 *         schema:
 *           type: string
 *           default: Asia/Colombo
 *         description: The timezone of the property - provided as a string
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/LineItems'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
