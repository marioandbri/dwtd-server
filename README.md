
# Dance with the Death - Server

This is the repo for the backend server builded to deliver the assignment and apply for a Fullstack Developer role on Asimov

## Tech stack

- **Development:** TypeScript, Express, Prisma
- **Database**: MongoDB
- **Open-API Documentation:** Swagger-JsDoc, Swagger-Ui-Express
- **Other Libs:** CORS

## Demo
**[Dance with the Death - Server](https://enigmatic-inlet-51051.herokuapp.com/)** - Server image builded with Docker and deployed on Heroku via Heroku CLI


## Documentation

**[Dance with the Death Endpoints Documentation](https://enigmatic-inlet-51051.herokuapp.com/docs)** - Documentation for the API Endpoints 


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL` = URL de conexion a la base de datos

`NODE_ENV` = "production" | "development"

`CLIENT` = URL de cliente o "*" para configurar el CORS


## Run Locally

Clone the project

```bash
  git clone https://github.com/marioandbri/dwtd-server.git
```

Go to the project directory

```bash
  cd dwtd-server
```

Install dependencies

```bash
  npm install
```
```bash
  yarn
```
Initialize the Prisma ORM

```bash
  npm run prisma-generate
```
```bash
  yarn prisma-generate
```

Start the server

```bash
  npm run dev
```
```bash
  yarn dev
```

