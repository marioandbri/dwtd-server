import { Router } from "express";
import { Appointment, PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/api/appointments", async (req, res) => {
	const { date } = req.query as { date: string };
	const appointments = await prisma.appointment.findMany();
	const dayAppointments = appointments.filter((e) =>
		e.datetime.toISOString().includes(date)
	);
	if (Boolean(date)) {
		res.json(dayAppointments);
		return;
	} else {
		res.json(appointments);
	}
});

router.post("/api/appointments", async (req, res) => {
	const newAppointment: Appointment = req.body;
	console.log(newAppointment);

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
