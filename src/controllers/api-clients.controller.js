const { Router } = require("express");
const bcrypt = require("bcrypt");
const ErrorResponse = require("../classes/error-response");
const { models } = require("../database/index");
const Employee = models.Employee;
const Clients = models.Client;
const ContactPerson = models.ContactPerson;
const Employee_Task = models.Employee_Task;
const Task = models.Task;
const TaskType = models.TaskType;
const TaskPriority = models.TaskPriority;
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
    router.get("/getClients", asyncHandler(getClients));
    router.post("/searchClient", asyncHandler(searchClient));
    // router.post("/completeTask", asyncHandler(completeTask));
    // router.post("/updateTask", asyncHandler(updateTask));
}

async function getClients(req, res, next) {
    const clients = await Clients.findAll();
    console.log("All users:", JSON.stringify(clients, null, 2));
        res.status(200).json({
        clients
    });
}

async function searchClient(req, res, next) {
    const cp = await ContactPerson.findOne({
        where: {
            name: req.body.name, 
        }
    })
    console.log("searchClient ContactPerson",cp);
    const client = await Clients.findOne({
        where: {
            id: cp.ClientId,
        }
    });

    console.log("All users:", JSON.stringify(client, null, 2));
        res.status(200).json({
        client
    });
}

initRoutes();

module.exports = router;
