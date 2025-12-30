import express from "express"
import {submitForm,getContactuser } from '../Controller/contactController.js'
const router = express.Router();

router.post("/submit", submitForm);
router.get("/contactuser", getContactuser);
export default router;