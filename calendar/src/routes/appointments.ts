import express from "express";
import Appointment from "../controller/appointmentController";

const router = express.Router();

const appointment = new Appointment();

router.get("/user/:userId/appointments", appointment.getAppointment); // GET request to get appointments
router.post("/user/:userId/appointments", appointment.makeAppointments); // POST request to create appointment
router.put(
    "/user/:userId/appointments/:appointmentId",
    appointment.updateUserAppointment
); // PUT request to update appointment
router.delete(
    "/user/:userId/appointments/:appointmentId",
    appointment.deleteAppointment
); // DELETE request to delete appointment

export default router;
