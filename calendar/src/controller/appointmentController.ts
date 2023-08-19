import { NextFunction, Request, Response } from "express";
import client from "../configs/database";
import { publishEvent } from "./publishConsumeEvent";
import { consumeEvent } from "./publishConsumeEvent";
import jwt from "jsonwebtoken";

client.connect();

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
                const query = "SELECT * FROM appointments WHERE user_id = $1";
                const values = [userId];
                const result = await client.query(query, values);

                const appointments = result.rows;
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
                const query = `INSERT INTO appointments (user_id, title, description, start_time, end_time) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
                const values = [
                    userId,
                    title,
                    description,
                    start_time,
                    end_time,
                ];
                const result = await client.query(query, values);

                const newAppointment = result.rows[0];
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

                // SQL query to update the appointment in the database
                const query = `UPDATE appointments SET title = $1, description = $2, start_time = $3, end_time = $4 WHERE id = $5 AND user_id = $6 RETURNING *`;
                const values = [
                    title,
                    description,
                    start_time,
                    end_time,
                    appointmentId,
                    userId,
                ];
                const result = await client.query(query, values);

                if (result.rowCount === 0) {
                    return res
                        .status(404)
                        .json({ message: "Appointment not found." });
                }

                const updatedAppointment = result.rows[0];
                await publishEvent("appointment_events", {
                    updatedAppointment,
                    action: "update",
                });
                res.json(updatedAppointment);
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
                // SQL query to delete the appointment from the database
                const query =
                    "DELETE FROM appointments WHERE id = $1 AND user_id = $2";
                const values = [appointmentId, userId];
                const result = await client.query(query, values);

                if (result.rowCount === 0) {
                    return res
                        .status(404)
                        .json({ message: "Appointment not found." });
                }
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
