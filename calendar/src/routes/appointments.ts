import express from "express";
import Appointment from "../controller/appointmentController";
const router = express.Router();

const appointment = new Appointment();

router.get(
    "/user/:userId/appointments",
    appointment.authenticate,
    appointment.getAppointment
);
router.post(
    "/user/:userId/appointments",
    appointment.authenticate,
    appointment.makeAppointments
);
router.put(
    "/user/:userId/appointments/:appointmentId",
    appointment.authenticate,
    appointment.updateUserAppointment
);
router.delete(
    "/user/:userId/appointments/:appointmentId",
    appointment.authenticate,
    appointment.deleteAppointment
);

export default router;
