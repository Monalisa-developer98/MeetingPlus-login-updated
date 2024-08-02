const jwt = require("jsonwebtoken");
const Responses = require("../helpers/response");
const messages = require("../constants/constMessages");
const employeeService = require("../services/employeeService");

/*FUNC TO GENERATE NEW TOKEN FOR USER*/
const generateUserToken = async (data) => {
  // Ensure that 'data' is a plain object
  if (typeof data !== 'object' || data === null) {
    throw new Error('Data must be a plain object');
  }
  
  const token = jwt.sign(data, process.env.JWT_USER_SECRET, {   // generate token
    expiresIn: "365d", // 365 days
  });
  return `Bearer ${token}`;
};

/*FUNC TO VERIFY A TOKEN FOR USER*/
const verifyUserToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    console.log("token-->", token);
    if (token && token.startsWith("Bearer ")) {
      token = token.substring(7, token.length);
    }
    const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
    console.log(decoded);
    const email = decoded.email;
    const isActiveUser = await employeeService.verifyEmployee(email);
    console.log("isActiveUser------", isActiveUser);
    if (isActiveUser) {
      req.email = email;
      req.userData = isActiveUser;
      next();
    } else {
      console.log("return from jwt verify");
      return Responses.failResponse(
        req,
        res,
        { isInValidUser: true },
        messages.invalidUser,
        200
      );
    }
  } catch (error) {
    console.log("Errorrr", error);
    return Responses.failResponse(req, res, null, messages.invaliToken, 200);
  }
};

module.exports = {
  generateUserToken,
  verifyUserToken,
};
