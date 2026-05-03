import express from "express"
import { submitForm, getContactuser } from '../Controller/contactController.js'

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact form APIs
 */

/**
 * @swagger
 * /api/contact/submit:
 *   post:
 *     summary: Submit a contact form
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, message]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sanjana Patidar
 *               email:
 *                 type: string
 *                 example: sanjana@gmail.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               message:
 *                 type: string
 *                 example: I have a question about my order.
 *     responses:
 *       201:
 *         description: Contact form submitted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Form submitted successfully
 *       400:
 *         description: Validation error — missing required fields
 *       500:
 *         description: Server error
 */
router.post("/submit", submitForm);

/**
 * @swagger
 * /api/contact/contactuser:
 *   get:
 *     summary: Get all contact form submissions (Admin)
 *     tags: [Contact]
 *     responses:
 *       200:
 *         description: List of all contact submissions
 *         content:
 *           application/json:
 *             example:
 *               - _id: "64f1c2abc777"
 *                 name: Sanjana Patidar
 *                 email: sanjana@gmail.com
 *                 message: I have a question about my order.
 *                 createdAt: "2026-05-03T10:00:00Z"
 *       500:
 *         description: Server error
 */
router.get("/contactuser", getContactuser);

export default router;