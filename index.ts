import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express, { Router } from "express";
import morgan from "morgan";
import AppointmentsRoute from "./routes/appointment.routes";
const prisma = new PrismaClient();
const router = Router();
(async function main() {
	const app = express();

	app.use(
		cors({
			origin: "*",
		})
	);
	app.use(express.json({}));
	app.use(morgan("dev"));

	router.get("/", (req, res) => {
		res.send("Server funcionando");
	});
	app.use(router);
	app.use(AppointmentsRoute);
	app.set("port", process.env.PORT || 4000);
	const serverPort = app.get("port");

	app.listen(serverPort, () => {
		console.log(`server en: http://localhost:${serverPort}`);
	});
})()
	.catch((e: Error) => {
		throw e;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
