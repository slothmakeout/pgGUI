const { Router } = require("express");
const bcrypt = require("bcrypt");
const fs = require('fs');
const csv = require('fast-csv')
const path = require("path")
const ErrorResponse = require("../classes/error-response");
const { models } = require("../database/index");
const Employee = models.Employee;
const Role = models.Role;
// const Token = require("../database/models/Token.model");
const { asyncHandler } = require("../middlewares/middlewares");
const router = Router();
const { Pool, Client } = require("pg");
const saltRounds = 3;
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
    router.post("/report", asyncHandler(getReport));
    router.get("/clients", asyncHandler(getClients));
}

async function setRole() {
    // Назначение роли
    let queryLine = `SET ROLE ${currentRole.name};`;
    await client.query(queryLine, (err, res) => {
        if (err) {
            console.log(err.stack);
        } else {
            console.log(res.rows[0]);
        }
    });
    //Проверка роли
    await client.query("SELECT CURRENT_ROLE;", (err, res) => {
        if (err) {
            console.log(err.stack);
        } else {
            console.log(res.rows[0]);
        }
    });
}

async function checkAdmin() {
    checkAdmin = await Employee.findOne({
        where: {
            login: currentRole.name,
            roleId: 3,
        },
    });
    if (!checkAdmin) {
        throw new ErrorResponse("You are not admin", 404);
    } else {
        console.log("ADMIN CHECK TRUE");
    }
}

async function getReport(req, res, next) {
    setRole();
    checkAdmin();

    queryLine = `CALL report(\'${req.body.id}\', \'${req.body.dateStart}\', \'${req.body.dateEnd}\');`;
    console.log(`QUERY LINE: ${queryLine}`);

    await client.query(queryLine, (err, res) => {
        if (err) {
            throw new ErrorResponse("Wrong data/format", 40);
        } else {
            console.log(`Отчёт создан в R:/report.csv`);
        }
    });
    // path.format({ ...path.parse('R:/report.csv'), base: undefined, ext: '.txt' })
    let fileContent = fs.readFileSync("R:/report.csv", "utf8");
    console.log(fileContent)
    res.status(200).json({
        message: "Report created",
    });
}

async function getClients(req, res, next) {
    setRole();
    checkAdmin();
    let { rows: Clients } = await client.query("SELECT * FROM \"Client\"");
    console.log(Clients);
    // Возвращаем задания
    res.status(200).json({
        Clients,
    });
}

initRoutes();

module.exports = router;
