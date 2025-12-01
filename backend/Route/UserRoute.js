import express from "express";
import {signup, login, getAllUsers} from '../Controller/UserController.js'


const router = express.Router();
 
router.post('/signup', signup);
router.post('/login', login);
router.get('/', getAllUsers);

export default router;