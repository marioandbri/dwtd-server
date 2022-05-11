import { Router } from "express";
import { Appointment, PrismaClient } from "@prisma/client";
import {
	filterAppointmentsByDate,
	validateAppointment,
} from "../utils/appointmentValidation";

const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique Id autogenerated for the appointment BSON document
 *         name:
 *           type: string
 *           description: User's name whom schedule the appointment
 *         email:
 *           type: string
 *           description: User's e-mail direcction for contact
 *         datetime:
 *           type: string
 *           format: date-time
 *           description: ISO formatted string representing the date and time for the appointment
 *       required:
 *         - name
 *         - email
 *         - datetime
 *       example:
 *         {"id": "627329b2731979cda246a912","name": "Prueba 2","email": "prueba@prueba.com","datetime": "2022-04-03T08:00:00.000Z"}
 * tags:
 *   name: Appointments
 *   description: Endpoints for CRUD operations with the Appointments data model
 */

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     tags: [Appointments]
 *     summary: Returns a list of scheduled appointments
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *           example: YYYY-MM-DD
 *         description: date for returning specific appointments
 *         required: false
 *     responses:
 *       200:
 *         description: List of appointments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Appointment"
 */

router.get("/api/appointments", async (req, res) => {
	const { date } = req.query as { date: string };
	const appointments = await prisma.appointment.findMany();
	const dayAppointments = filterAppointmentsByDate(date, appointments);
	if (Boolean(date)) {
		res.json(dayAppointments);
		return;
	} else {
		res.json(appointments);
	}
});

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     tags: [Appointments]
 *     summary: Schedules an appointment
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Appointment"
 *     responses:
 *       200:
 *         description: Operation result message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message describing the result of the operation
 *                   example: Appointment scheduled successfully
 *       400:
 *         description: Operation result message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message describing the result of the operation
 *                   example: Something went wrong
 */

router.post("/api/appointments", async (req, res) => {
	const newAppointment: Appointment = req.body;

	if (
		!newAppointment.datetime ||
		!newAppointment.email ||
		!newAppointment.name
	) {
		res
			.status(400)
			.json({ message: "Some data for the appointment is missing 🤔" });
		return;
	}
	try {
		const appointments = await prisma.appointment.findMany();
		const date = new Date(newAppointment.datetime);
		const dayAppointments = filterAppointmentsByDate(
			date.toISOString().replace(/T.*/, ""),
			appointments
		);
		const validationResults = validateAppointment(
			date,
			{ name: newAppointment.name, email: newAppointment.email },
			dayAppointments
		);

		if (!validationResults.valid) {
			res.status(400).json({ message: validationResults.message });
			return;
		}

		const result = await prisma.appointment.create({
			data: newAppointment,
		});

		res.json({ message: "The appointment was created successfully 👌" });
	} catch (e) {
		if (e.code === "P2002" && e.meta.target.includes("datetime")) {
			res.status(400).json({
				message: "This hour was already scheduled, please select another one",
			});
		} else {
			res.status(400).json({
				message: "Something went wrong, please try again",
			});
		}
	}
});

/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     tags: [Appointments]
 *     summary: Updates a Scheduled appointment
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: Id of the appointment to update
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Appointment"
 *     responses:
 *       200:
 *         description: Operation result message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message describing the result of the operation
 *                   example: Appointment [id] updated
 *       400:
 *         description: Operation result message (error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message describing the result of the operation
 *                   example: Couldn't to update this appointment, please check the data
 */
router.put("/api/appointments/:id", async (req, res) => {
	const updadateData: Partial<Appointment> = req.body;
	const id = req.params.id;
	try {
		const result = await prisma.appointment.update({
			where: { id: id },
			data: updadateData,
		});
		res.json({ message: `Appointment (${id}) updated` });
	} catch (error) {
		res.status(400).json({
			message: "Couldn't to update this appointment, please check the data",
		});
	}
});

/**
 * @swagger
 * /api/appointments/{id}:
 *   delete:
 *     tags: [Appointments]
 *     summary: Deletes a Scheduled appointment
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: Id of the appointment to delete
 *     responses:
 *       200:
 *         description: Operation result message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message describing the result of the operation
 *                   example: The appointment [id] was correctly removed
 *       400:
 *         description: Operation result message (error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message describing the result of the operation
 *                   example: Something went wrong
 */
router.delete("/api/appointments/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const result = await prisma.appointment.delete({
			where: { id: id },
		});
		res.json({ message: `The appointmet (${id}) was correctly removed` });
	} catch (error) {
		res
			.status(400)
			.json({ message: "Something went wrong, please try again later" });
	}
});

export default router;
