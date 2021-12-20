const path = require("path");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  database: "Practice",
  username: "postgres",
  password: "1234",
});

var initModels = require("./models/init-models");
var models = initModels(sequelize);


const initDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Sequelize was initialized");
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

module.exports = {
  sequelize,
  models,
  initDB,
};
