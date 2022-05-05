import { Router } from "express";
import { Appointment, PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/api/appointments", async (req, res) => {
	const appointments = await prisma.appointment.findMany();
	res.json(appointments);
});

router.post("/api/appointments", async (req, res) => {
	const newAppointment: Appointment = req.body.appointment;
	const result = await prisma.appointment.create({
		data: newAppointment,
	});
	res.json({ result });
});

router.put("/api/appointments/:id", async (req, res) => {
	const updadateData: Partial<Appointment> = req.body.appointment;
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
