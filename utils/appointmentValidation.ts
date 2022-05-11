import { Appointment } from "@prisma/client";
export const filterAppointmentsByDate = (
	date: string,
	appointments: Appointment[]
) => appointments.filter((e) => e.datetime.toISOString().includes(date));

export const validateAppointment = (
	date: Date,
	userData: { name: string; email: string },
	appointments: Appointment[]
): { valid: boolean; message?: string } => {
	if (
		date.toDateString().includes("Sat") ||
		date.toDateString().includes("Sun")
	) {
		return {
			valid: false,
			message: "Can't schedule an appointment for the weekend",
		};
	}
	if (
		appointments.some(
			(e) => e.email === userData.email || e.name === userData.name
		)
	) {
		return {
			valid: false,
			message: "You already have a scheduled hour to dance with the Death",
		};
	} else return { valid: true };
};
