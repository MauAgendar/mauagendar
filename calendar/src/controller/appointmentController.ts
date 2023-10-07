import { NextFunction, Request, Response } from "express";
import { publishEvent } from "./publishConsumeEvent";
import { consumeEvent } from "./publishConsumeEvent";
import jwt from "jsonwebtoken";

import AppointmentModel from "../models/appointment";

class Appointment {
    userId: number;
    constructor() {
        // Start consuming events from the authentication
        this.userId = 0;
        this.consumeAuthenticationEvent();
    }

    consumeAuthenticationEvent = async () => {
        try {
            // Start consuming events from the authentication queue
            consumeEvent("auth_queue", async (event) => {
                const { token } = event;
                console.log("Consuming authentication event:", event);
                console.log(token);
                const decodedToken: any = jwt.verify(
                    token,
                    process.env.SECRET_KEY as string,
                    (err: any, decoded: any) => {
                        if (err) {
                            console.error("Error decoding token:", err);
                            return null;
                        }
                        console.log(decoded);
                        return decoded;
                    }
                );
                console.log(decodedToken);
                this.userId = decodedToken["user_id"];
            });
            console.log("Consuming authentication events from auth_queue");
        } catch (error) {
            console.error("Error consuming authentication event:", error);
        }
    };

    authenticate = (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers["authorization"];
        if (authHeader) {
            const token = authHeader.split(" ")[1]; // Assuming format is "Bearer token"
            jwt.verify(
                token,
                process.env.SECRET_KEY as string,
                (err: any, decoded: any) => {
                    if (err) {
                        console.error("Error decoding token:", err);
                        res.status(401).json({
                            message: "Authentication failed.",
                        });
                    } else {
                        console.log(decoded);
                        this.userId = decoded["user_id"];
                        next();
                    }
                }
            );
        } else {
            res.status(401).json({ message: "Authentication required." });
        }
    };

    getAppointment = async (req: Request, res: Response) => {
        const { userId } = req.params;
        if (userId !== this.userId.toString()) {
            return res.status(401).json({ message: "Authentication failed." });
        }
        try {
            // Check authentication
            this.authenticate(req, res, async () => {
                // SQL query to retrieve user's appointments from the database
                const appointments = await AppointmentModel.findAll({
                    where: {
                        user_id: userId,
                    },
                });

                await publishEvent("appointment_events", {
                    appointments,
                    action: "read",
                });
                res.json(appointments);
            });
        } catch (error) {
            console.error("Error retrieving appointments:", error);
            res.status(500).json({ message: "Error retrieving appointments." });
        }
    };

    makeAppointments = async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { title, description, start_time, end_time } = req.body;
        if (userId !== this.userId.toString()) {
            return res.status(401).json({ message: "Authentication failed." });
        }
        try {
            // Check authentication
            this.authenticate(req, res, async () => {
                // Check if all fields are provided
                if (!title || !description || !start_time || !end_time) {
                    return res
                        .status(400)
                        .json({ message: "All fields are required." });
                }

                // SQL query to create a new appointment in the database
                const newAppointment = await AppointmentModel.create({
                    user_id: userId,
                    title,
                    description,
                    start_time,
                    end_time,
                });

                await publishEvent("appointment_events", {
                    newAppointment,
                    action: "create",
                });
                res.status(201).json(newAppointment);
            });
        } catch (error) {
            console.error("Error creating appointment:", error);
            res.status(500).json({ message: "Error creating appointment." });
        }
    };

    updateUserAppointment = async (req: Request, res: Response) => {
        const { userId, appointmentId } = req.params;
        const { title, description, start_time, end_time } = req.body;
        if (userId !== this.userId.toString()) {
            return res.status(401).json({ message: "Authentication failed." });
        }
        try {
            // Check authentication
            this.authenticate(req, res, async () => {
                // Check if all fields are provided
                if (!title || !description || !start_time || !end_time) {
                    return res
                        .status(400)
                        .json({ message: "All fields are required." });
                }

                if (userId !== this.userId.toString()) {
                    return res
                        .status(401)
                        .json({ message: "Authentication failed." });
                }

                const appointment = await AppointmentModel.findOne({
                    where: {
                        id: appointmentId,
                        user_id: userId,
                    },
                });

                if (!appointment) {
                    return res
                        .status(404)
                        .json({ message: "Appointment not found." });
                }

                appointment.title = title;
                appointment.description = description;
                appointment.start_time = start_time;
                appointment.end_time = end_time;

                await appointment.save();

                await publishEvent("appointment_events", {
                    updatedAppointment: appointment,
                    action: "update",
                });

                res.json(appointment);
            });
        } catch (error) {
            console.error("Error updating appointment:", error);
            res.status(500).json({ message: "Error updating appointment." });
        }
    };

    deleteAppointment = async (req: Request, res: Response) => {
        const { userId, appointmentId } = req.params;
        if (userId !== this.userId.toString()) {
            return res.status(401).json({ message: "Authentication failed." });
        }
        try {
            // Check authentication
            this.authenticate(req, res, async () => {
                const appointment = await AppointmentModel.findOne({
                    where: {
                        id: appointmentId,
                        user_id: userId,
                    },
                });
                if (!appointment) {
                    return res
                        .status(404)
                        .json({ message: "Appointment not found." });
                }
                appointment.destroy();
                await publishEvent("appointment_events", {
                    userId,
                    appointmentId,
                    action: "delete",
                });
                res.status(204).send();
            });
        } catch (error) {
            console.error("Error deleting appointment:", error);
            res.status(500).json({ message: "Error deleting appointment." });
        }
    };
}

export default Appointment;
