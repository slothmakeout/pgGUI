const express = require("express");
const http = require("http");
const cors = require("cors");
const { initDB } = require("./database");
const { notFound, errorHandler } = require("./middlewares/middlewares");

const { router:apiAuthRouter } = require("./controllers/api-auth.controller");
const apiTasksRouter = require("./controllers/api-tasks-controller");
const apiInfoRouter = require("./controllers/api-info.controller");
const apiClientsRouter = require("./controllers/api-clients.controller");
const apiContactPersonsRouter = require("./controllers/api-contactPersons-controller")
const apiEmployeeRouter = require("./controllers/api-employee-controller")

var app = express();
// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
  res.render('pages/index');
  console.log(123)
});

// about page
app.get('/about', function (req, res) {
  res.render('pages/about');

});

initDB();

app.use(cors());

app.use((req, res, next) => {
  console.log("URL = ", req.url);
  console.log("Original_URL = ", req.originalUrl);
  console.log("METHOD = ", req.method);
  console.log("HOST = ", req.headers.host);
  console.log("IsSecure = ", req.secure);
  console.log("BODY", req.body);
  console.log("QUERY", req.query);

  next();
});

app.use(express.json());
app.use("/api/auth", apiAuthRouter);
app.use("/api/tasks", apiTasksRouter);
app.use("/api/info", apiInfoRouter);
app.use("/api/clients", apiClientsRouter)
app.use("/api/contactPersons", apiContactPersonsRouter)
app.use("/api/employees", apiEmployeeRouter)
app.use(notFound);
app.use(errorHandler);

app.set('view engine', 'ejs')

app.get('/', function(req, res) {
  res.render('R:/Учёба/5 Семестр/БД/back/src/views/pages/index');
});

// about page
app.get('/about', function(req, res) {
  res.render('pages/about');
});

http.createServer(app).listen(3000, () => {
  console.log("Server started");
});

