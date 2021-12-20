const { Router } = require("express");
const bcrypt = require("bcrypt");
const ErrorResponse = require("../classes/error-response");
const { models } = require("../database/index");
const Employee = models.Employee;
const { asyncHandler } = require("../middlewares/middlewares");
const router = Router();
const { Pool, Client } = require("pg");
const { currentRole } = require("./api-auth.controller");

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "Practice",
    password: "1234",
    port: 5432,
});
client.connect();

function initRoutes() {
    router.get("/getEmployee", asyncHandler(getEmployee));
    // router.post("/createTask", asyncHandler(createTask));
    // router.post("/completeTask", asyncHandler(completeTask));
    // router.post("/updateTask", asyncHandler(updateTask));
}

async function getEmployee(req, res, next) {
    const employees = await Employee.findAll();
    console.log("All Employees:", JSON.stringify(employees, null, 2));
    res.status(200).json({
        employees,
    });
}

initRoutes();

module.exports = router;
