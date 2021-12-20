const { Router } = require("express");
const bcrypt = require("bcrypt");
const ErrorResponse = require("../classes/error-response");
const { models } = require("../database/index");
const ContactPerson = models.ContactPerson;
const clients = models.Client;
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
    router.get("/getContactPersons", asyncHandler(getContactPersons));
    // router.post("/createTask", asyncHandler(createTask));
    // router.post("/completeTask", asyncHandler(completeTask));
    // router.post("/updateTask", asyncHandler(updateTask));
}

async function getContactPersons(req, res, next) {
    const cp = await ContactPerson.findAll();


    for (const key in cp) {
        const person = cp[key];
        
        const client = await clients.findOne({
            where: {
                id:person.ClientId,
            }
        })
        person.ClientId = client.companyName;
        
    }
    console.log("All CP:", JSON.stringify(cp, null, 2));
    res.status(200).json({
        cp,
    });
}

initRoutes();

module.exports = router;
