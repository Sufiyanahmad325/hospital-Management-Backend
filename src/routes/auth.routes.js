import express from "express";
import {registerPatient,login} from "../controllers/authController/auth.controller.js";

const router = express.Router();



router.post("/registerPatient", registerPatient); // patient register
router.post("/login", login);               // all roles login

export default router;
