import express from "express";
import {
  getDoctorAppointments,
  updateAppointmentStatus,
} from "../controllers/doctor.controller.js";

import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import { isDoctor } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(verifyJWT, isDoctor);

router.get("/get-appointments", getDoctorAppointments);
router.put("/updateAppointmentStatus/:id", updateAppointmentStatus);

export default router;
