const { Router } = require("express");
const bcrypt = require("bcrypt");
const ErrorResponse = require("../classes/error-response");
const { models } = require("../database/index");
const Employee = models.Employee;
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

function setRole() {
    // Назначение роли
    let queryLine = `SET ROLE ${currentRole.name};`;
    client.query(queryLine, (err, res) => {
        if (err) {
            console.log(err.stack);
        } else {
            console.log(res.rows[0]);
        }
    });
    //Проверка роли
    client.query("SELECT CURRENT_ROLE;", (err, res) => {
        if (err) {
            console.log(err.stack);
        } else {
            console.log(res.rows[0]);
        }
    });
}
function initRoutes() {
    router.get("/getTasks", asyncHandler(getTasks));
    router.post("/createTask", asyncHandler(createTask));
    router.post("/completeTask", asyncHandler(completeTask));
    router.post("/updateTask", asyncHandler(updateTask));
}

async function getTasks(req, res, next) {
    // Назначение роли
    await setRole();
    // Получаем задания
    let { rows: Tasks } = await client.query("SELECT * FROM getTasks()");
    console.log(typeof Tasks);
    // Возвращаем задания
    for (const key in Tasks) {
        const task = Tasks[key];
        console.log(`TASK: `, task)
        let cp = task.ContactPersonId
        console.log(`CP: `, cp)
        const cpName = await ContactPerson.findOne({
            where: {
                id: cp
            }
        })
        const exEmployee_Task = await Employee_Task.findOne({
            where: {
                taskId: task.Id
            }
        })
        const exLogin = await Employee.findOne({
            where: {
                id: exEmployee_Task.employeeId
            }
        })
        console.log(exLogin)
        // Форматируем время
        if (task.ExecutionTime != null) {
            task.ExecutionTime = task.ExecutionTime.toLocaleString()
        }
        if (task.CompletedAt != null) {
            task.CompletedAt = task.CompletedAt.toLocaleString()
        }
        task.CreatedAt = task.CreatedAt.toLocaleString()

        task.ContactPersonName = cpName.name
        task.ExecutorLogin = exLogin.login
    }
    
    res.status(200).json({
        Tasks
    });
}

async function createTask(req, res, next) {
    // Нынешний сотрудник
    const currentUser = await Employee.findOne({
        where: {
            login: currentRole.name,
        },
    });
    if (!currentUser) {
        throw new ErrorResponse("No such user", 400);
    } else {
        console.log("CURRENT USER: ", currentUser);
    }

    // Исполнитель
    const executor = await Employee.findOne({
        where: {
            login: req.body.employeeLogin,
        },
    });
    if (!executor) {
        throw new ErrorResponse("Wrong Executor", 400);
    } else {
        console.log("EXECUTOR: ", executor);
    }

    await setRole();

    const contactPerson = await ContactPerson.findOne({
        where: {
            name: req.body.contactPersonName,
        },
    });

    // Если такого контакного лица нет, выдаёт ошибку
    if (!contactPerson) {
        throw new ErrorResponse("Wrong contact person", 400);
    } else {
        console.log("CONTACT PERSON: ", contactPerson);
    }

    console.log(req.body.createdAt);
    //Создаём новое задание
    const newTask = await Task.create({
        contactPersonId: contactPerson.id,
        contractId: req.body.contractId,
        description: req.body.description,
        createdAt: req.body.createdAt,
        executionTime: req.body.executionTime,
        typeId: req.body.typeId,
        priorityId: req.body.priorityId,
        isDone: null,
    });
    //Создаём запись в промежуточной таблице
    const newEmployee_Task = await Employee_Task.create({
        taskId: newTask.id,
        employeeId: executor.id,
        creatorId: currentUser.id,
    });
    // Возвращаем задания
    res.status(200).json({
        message: "Task Created",
    });
}

async function completeTask(req, res, next) {
    // Назначение роли
    await setRole();
    // Получаем задания
    const taskChange = await Task.findOne({
        where: {
            id: req.body.id,
        },
    });

    if (!taskChange) {
        throw new ErrorResponse("Wrong task", 400);
    } else {
        console.log("Employee wil change this task: ", taskChange);
    }

    await taskChange.update({
        isDone: true,
    });
    // Возвращаем задания
    res.status(200).json({
        message: "OK",
    });
}

async function updateTask(req, res, next) {
    await setRole();
    // Нынешний сотрудник который намеревается изменить задание
    const currentUser = await Employee.findOne({
        where: {
            login: currentRole.name,
        },
    });
    if (!currentUser) {
        throw new ErrorResponse("No such user", 400);
    } else {
        console.log("CURRENT USER: ", currentUser);
    }

    //Исполнитель, которого хочет назначить сотрудник
    const executor = await Employee.findOne({
        where: {
            login: req.body.employeeLogin,
        },
    });
    if (!executor) {
        throw new ErrorResponse("Wrong Executor", 400);
    } else {
        console.log("EXECUTOR: ", executor);
    }

    await setRole();

    // Контактное лицо
    const contactPerson = await ContactPerson.findOne({
        where: {
            name: req.body.contactPersonName,
        },
    });

    // Если такого контакного лица нет, выдаёт ошибку
    if (!contactPerson) {
        throw new ErrorResponse("Wrong contact person", 400);
    } else {
        console.log("CONTACT PERSON: ", contactPerson);
    }

    //Ищем задание которое будем обновлять
    const taskUpd = await Employee_Task.findOne({
        where: {
            taskId: req.body.id,
            creatorId: currentUser.id,
        },
    });

    if (!taskUpd) {
        throw new ErrorResponse("There is no Task you want", 400);
    } else {
        console.log("\nTHIS TASK WILL BE CHANGED: ", taskUpd.dataValues, "\nEXECUTOR ID IS:", executor.id);
    }

    const taskMain = await Task.findOne({
        where: {
            id: taskUpd.taskId
        }
    })

    await taskMain.update({
        contactPersonId: contactPerson.id,
        contractId: req.body.contractId,
        description: req.body.description,
        createdAt: req.body.createdAt,
        executionTime: req.body.executionTime,
        typeId: req.body.typeId,
        priorityId: req.body.priorityId,
        isDone: req.body.isDone,
    });
    const queryLine = `SET ROLE ADMIN; UPDATE \"Employee_Task\" SET \"employeeId\" = \'${executor.id}\' WHERE "taskId" = \'${taskUpd.taskId}\'; SET ROLE ${currentRole.name};`
    await client.query(queryLine, (err, res) => {
        if (err) {
            console.log(err.stack);
        } else {
            console.log('employee_task OK', currentRole.name);
        }
    });
    await taskUpd.update({
        employeeId: executor.id
    })

    // Возвращаем задания
    res.status(200).json({
        message: "OK",
    });
}

initRoutes();

module.exports = router;
