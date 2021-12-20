const { Router } = require("express");
const ErrorResponse = require('../classes/error-response');
const ToDo = require("../database/models/ToDo.model");
const { asyncHandler, requireToken } = require("../middlewares/middlewares");

const router = Router();

function initRoutes() {
  router.get("/", asyncHandler(requireToken), asyncHandler(getToDos));
  router.get("/:id", asyncHandler(requireToken), asyncHandler(getToDoById));
  router.post("/", asyncHandler(requireToken), asyncHandler(createToDo));
  router.delete("/", asyncHandler(requireToken), asyncHandler(deleteToDos));
  router.delete(
    "/:id",
    asyncHandler(requireToken),
    asyncHandler(deleteToDoById)
  );
  router.patch(
    "/:id",
    asyncHandler(requireToken),
    asyncHandler(updateToDoById)
  );
}

async function getToDos(req, res, next) {
  const todos = await ToDo.findAll({
    where: {
      userId: req.token.userId,
    },
  });

  res.json({ todos });
}

async function getToDoById(req, res, next) {
  //Находим одну ToDo по id из params
  const todo = await ToDo.findOne({
    where: {
      id: req.params.id,
      userId: req.token.userId,
    },
  });

  if (!todo) {
    throw new ErrorResponse("ToDo is not found by id", 404);
  }

  res.json(todo);
}

async function createToDo(req, res, next) {
  const todo = await ToDo.create({
    ...req.body,
    userId: req.token.userId,
  });

  res.json(todo);
}

async function deleteToDoById(req, res, next) {
  const todo = await ToDo.findOne({
    where: {
      id: req.params.id,
      userId: req.token.userId,
    },
  });

  if (!todo) {
    throw new ErrorResponse("ToDo is not found by id", 404);
  }

  await todo.destroy();

  res.json(todo);
}

async function deleteToDos(req, res, next) {
  await ToDo.destroy({
    where: {
      userId: req.token.userId,
    }
  });

  res.json({ message: "ToDos have been deleted" });
}

async function updateToDoById(req, res, next) {
  const todo = await ToDo.findOne({
    where: {
      id: req.params.id,
      userId: req.token.userId,
    },
  });

  if (!todo) {
    throw new ErrorResponse("ToDo is not found by id", 404);
  }

  await todo.update(req.body);

  res.json(todo);
}

initRoutes();

module.exports = router;
