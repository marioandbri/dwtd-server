import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express, { Router } from "express";
import morgan from "morgan";
import AppointmentsRoute from "./routes/appointment.routes";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import { options } from "./swaggerOptions";

const prisma = new PrismaClient();
const router = Router();

(async function main() {
	const app = express();

	app.use(
		cors({
			origin: process.env.CLIENT,
		})
	);
	app.use(express.json({}));
	process.env.NODE_ENV === "developemt" && app.use(morgan("dev"));

	router.get("/", (req, res) => {
		res.send("Server funcionando");
	});
	app.use(router);

	const specs = swaggerJsDoc(options);

	//Ruta
	app.use(AppointmentsRoute);

	//Swagger UI
	app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));

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
