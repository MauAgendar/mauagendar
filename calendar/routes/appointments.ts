import express from "express";
import { Request, Response } from "express";
import Appointment from "../controller/appointmentController";

const router = express.Router();

const appointment = new Appointment();

router.get("/user/:userId/appointments", appointment.getAppointment); // GET request de obter compromissos
router.post("/user/:userId/appointments", appointment.makeAppointments); // POST request de criar compromisso
router.put(
    "/user/:userId/appointments/:appointmentId",
    appointment.updateUserAppointment
); // PUT request de atualizar compromisso
router.delete(
    "/user/:userId/appointments/:appointmentId",
    appointment.deleteAppointment
); // DELETE request de deletar compromisso

export default router;
