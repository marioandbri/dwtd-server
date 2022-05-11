export const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Dance with the Death Appointments API",
			version: "1.0.0",
			description: "Dance with the Death appointment REST API server",
		},
		servers: [
			{
				url: "https://enigmatic-inlet-51051.herokuapp.com",
				description: "Production server",
			},
			{
				url: "http://localhost:4000",
				description: "Development server",
			},
		],
	},
	apis: ["./routes/*.ts"],
};
