import { Router } from "express";
import { Appointment, PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/api/appointments", async (req, res) => {
	const appointments = await prisma.appointment.findMany();
	res.json(appointments);
});

router.post("/api/appointments", async (req, res) => {
	const newAppointment: Appointment = req.body;

	if (
		!newAppointment?.datetime ||
		!newAppointment?.email ||
		!newAppointment?.name
	) {
		res
			.status(400)
			.json({ message: "Some data for the appointment is missing 🤔" });
		return;
	}
	const result = await prisma.appointment.create({
		data: newAppointment,
	});
	res.json({ result });
});

router.put("/api/appointments/:id", async (req, res) => {
	const updadateData: Partial<Appointment> = req.body;
	const id = req.params.id;
	const result = await prisma.appointment.update({
		where: { id: id },
		data: updadateData,
	});
	res.json({ result });
});

router.delete("/api/appointments/:id", async (req, res) => {
	const id = req.params.id;
	const result = await prisma.appointment.delete({
		where: { id: id },
	});
	res.json({ result });
});

export default router;
