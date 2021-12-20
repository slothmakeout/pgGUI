const { Router } = require("express");
const User = require("../database/models/User.model.js");
const { asyncHandler, requireToken } = require("../middlewares/middlewares");

const router = Router();

function initRoutes() {
  router.get("/me", asyncHandler(requireToken), asyncHandler(getInfo));
  router.patch("/me", asyncHandler(requireToken), asyncHandler(updateInfo)); //обновление информации
  router.post("/logout", asyncHandler(requireToken), asyncHandler(logout)); //выход из аккаунта
}

async function getInfo(req, res, next) {
  const user = await User.findByPk(req.token.userId);
  res.json(user);
}

async function updateInfo(req, res, next) {
  const user = await User.findByPk(req.token.userId);
  // If you want to update a specific set of fields, you can use update
  await user.update(req.body);
  res.json(user);
}

async function logout(req, res, next) {
  await req.token.destroy();
  res.json({ message: "OK" });
}

initRoutes();

module.exports = router;
