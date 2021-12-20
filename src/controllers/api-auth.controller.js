const { Router } = require("express");
const bcrypt = require("bcrypt");
const ErrorResponse = require("../classes/error-response");
const { models } = require("../database/index");
const Employee = models.Employee;
const Role = models.Role;
// const Token = require("../database/models/Token.model");
const { asyncHandler } = require("../middlewares/middlewares");
const router = Router();
const { Pool, Client } = require("pg");
const saltRounds = 3;
let currentRole = {
    name: "",
};

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "Practice",
    password: "1234",
    port: 5432,
});
client.connect();

function initRoutes() {
    router.post("/registration", asyncHandler(register));
    router.post("/login", asyncHandler(auth));
    router.get("/logout", asyncHandler(logout));
}

async function register(req, res, next) {
    // Проверяем, зарегистрирован ли такой сотрудник
    const checkEmployee = await Employee.findOne({
        where: {
            login: req.body.login,
        },
    });
    // Если такой сотрудник уже есть, выдаёт ошибку
    if (checkEmployee) {
        throw new ErrorResponse("This login already in use", 400);
    }
    // Получаем роль по id
    const newRole = await Role.findOne({
        where: {
            id: req.body.roleId,
        },
    });
    roleName = newRole.name.toLowerCase();
    const queryLine = `CREATE USER ${req.body.login} WITH PASSWORD '${req.body.password}' IN ROLE ${roleName};`;
    // Шифруем пароль
    const hash = bcrypt.hashSync(req.body.password, saltRounds);

    // Создаём нового сотрудника
    const newEmployee = await Employee.create({
        ...req.body,
        password: hash,
    });
    // Отправляем запрос, чтобы назначить ему роль
    client.query(queryLine, (err, res) => {
        if (err) {
            console.log(err.stack);
        } else {
            console.log(`Роль присвоена: ${queryLine}`);
        }
    });

    res.status(200).json({
        message: `Employee registered`,
    });
}

async function auth(req, res, next) {
    //На бэк отправляется login+password
    //Ищем пользователя с введенным email+password
    const checkEmployee = await Employee.findOne({
        where: {
            login: req.body.login,
        },
    });
    //Проверка - существует ли юзер в БД
    if (
        !checkEmployee ||
        (checkEmployee &&
            !bcrypt.compareSync(req.body.password, checkEmployee.password) &&
            checkEmployee &&
            !bcrypt.compareSync(req.body.password, checkEmployee.password) &&
            req.body.password != checkEmployee.password)
    ) {
        throw new ErrorResponse("There is no user with this login+pass", 404);
    }
    currentRole.name = checkEmployee.login;
    const { name: roleCheck } = await Role.findOne({
        where: {
            id: checkEmployee.roleId,
        },
    })
    console.log(roleCheck);
    res.status(200).json({ roleCheck } );
}

async function logout(req, res, next) {
    currentRole = "";
    res.status(200).json({
        currentRole,
    });
}
initRoutes();

module.exports = { router, currentRole };
