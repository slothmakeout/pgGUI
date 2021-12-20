const ErrorResponse = require("../classes/error-response");
// const { currentRole } = require("../controllers/api-auth.controller");
// const Token = require("../database/models/Token.model");

const syncHandler = (fn) => (req, res, next) => {
    try {
        fn(req, res, next);
    } catch (error) {
        next(error);
    }
};

const notFound = (req, _res, next) => {
    next(new ErrorResponse(`Not found - ${req.originalUrl}`, 404));
};

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const errorHandler = (e, request, res, _) => {
    let code = 500;
    if (typeof e.code === "number") {
        code = e.code;
    }

    return res.status(code || 500).json({
        message: e.message,
    });
};

// const requireToken = async (req, res, next) => {
//   const accessToken = req.get("x-access-token");
//   if (!accessToken) {
//     throw new ErrorResponse("Token wasn't sent", 400);
//   }
//   const tokenFromDB = await Token.findOne({
//     where: {
//       value: accessToken,
//     },
//   });
//   if (!tokenFromDB) {
//     throw new ErrorResponse("Wrong token", 401);
//   }
//   req.token = tokenFromDB;

//   next();
// };

const checkAdmin = async (req, res, next) => {
    const checkAdmin = await Employee.findOne({
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
    next();
};

const setRole = async (req, res, next) => {
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
};

module.exports = {
    asyncHandler,
    syncHandler,
    notFound,
  errorHandler,
    // requireToken,
};
