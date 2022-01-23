const express = require("express");
const validate = require("../middlewares/validate");
const statusController = require("../controllers/status.controller");

const router = express.Router();

router.route("/").get(statusController.getStatus);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Status
 *   description: API status check
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get api status
 *     description: Fetches API status
 *     tags: [Status]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: date
 *                 message:
 *                   type: string
 */
