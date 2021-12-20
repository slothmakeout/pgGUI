var DataTypes = require("sequelize").DataTypes;
var _Client = require("./Client");
var _ContactPerson = require("./ContactPerson");
var _Contract = require("./Contract");
var _ContractType = require("./ContractType");
var _Employee = require("./Employee");
var _Employee_Task = require("./Employee_Task");
var _Role = require("./Role");
var _Task = require("./Task");
var _TaskPriority = require("./TaskPriority");
var _TaskType = require("./TaskType");

function initModels(sequelize) {
  var Client = _Client(sequelize, DataTypes);
  var ContactPerson = _ContactPerson(sequelize, DataTypes);
  var Contract = _Contract(sequelize, DataTypes);
  var ContractType = _ContractType(sequelize, DataTypes);
  var Employee = _Employee(sequelize, DataTypes);
  var Employee_Task = _Employee_Task(sequelize, DataTypes);
  var Role = _Role(sequelize, DataTypes);
  var Task = _Task(sequelize, DataTypes);
  var TaskPriority = _TaskPriority(sequelize, DataTypes);
  var TaskType = _TaskType(sequelize, DataTypes);

  Employee.belongsToMany(Task, { as: 'taskId_Tasks', through: Employee_Task, foreignKey: "employeeId", otherKey: "taskId" });
  Task.belongsToMany(Employee, { as: 'employeeId_Employees', through: Employee_Task, foreignKey: "taskId", otherKey: "employeeId" });
  ContactPerson.belongsTo(Client, { as: "Client", foreignKey: "ClientId"});
  Client.hasMany(ContactPerson, { as: "ContactPeople", foreignKey: "ClientId"});
  Task.belongsTo(ContactPerson, { as: "contactPerson", foreignKey: "contactPersonId"});
  ContactPerson.hasMany(Task, { as: "Tasks", foreignKey: "contactPersonId"});
  Task.belongsTo(Contract, { as: "contract", foreignKey: "contractId"});
  Contract.hasMany(Task, { as: "Tasks", foreignKey: "contractId"});
  Contract.belongsTo(ContractType, { as: "type", foreignKey: "typeId"});
  ContractType.hasMany(Contract, { as: "Contracts", foreignKey: "typeId"});
  Employee_Task.belongsTo(Employee, { as: "creator", foreignKey: "creatorId"});
  Employee.hasMany(Employee_Task, { as: "Employee_Tasks", foreignKey: "creatorId"});
  Employee_Task.belongsTo(Employee, { as: "employee", foreignKey: "employeeId"});
  Employee.hasMany(Employee_Task, { as: "employee_Employee_Tasks", foreignKey: "employeeId"});
  Employee.belongsTo(Role, { as: "role", foreignKey: "roleId"});
  Role.hasMany(Employee, { as: "Employees", foreignKey: "roleId"});
  Employee_Task.belongsTo(Task, { as: "task", foreignKey: "taskId"});
  Task.hasMany(Employee_Task, { as: "Employee_Tasks", foreignKey: "taskId"});
  Task.belongsTo(TaskPriority, { as: "priority", foreignKey: "priorityId"});
  TaskPriority.hasMany(Task, { as: "Tasks", foreignKey: "priorityId"});
  Task.belongsTo(TaskType, { as: "type", foreignKey: "typeId"});
  TaskType.hasMany(Task, { as: "Tasks", foreignKey: "typeId"});

  return {
    Client,
    ContactPerson,
    Contract,
    ContractType,
    Employee,
    Employee_Task,
    Role,
    Task,
    TaskPriority,
    TaskType,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
