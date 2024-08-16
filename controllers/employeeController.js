const employeeService = require("../services/employeeService");
const Responses = require("../helpers/response");
const messages = require("../constants/constMessages");
const authMiddleware = require("../middlewares/authMiddleware");

/**FUNC- TO CREATE EMPLOYEE**/
const createEmployee = async (req, res) => {
    try {
      const result = await employeeService.createEmployee(req.body);
      console.log(result);
      // optional chaining --- it will check, if the user property has isDuplicateEmail property
      if (result?.isDuplicateEmail) { // instead of causing an error if a reference is nullish (null or undefined), the expression short-circuits with a return value of undefined
        return Responses.failResponse(req, res, null, messages.duplicateEmail, 200);
      }
  
      return Responses.successResponse(req, res, result.data, messages.createdSuccess, 201 );
    } catch (error) {
      console.log(error);
      return Responses.errorResponse(req, res, error);
    }
};


/**FUNC- TO EDIT EMPLOYEE **/
const editEmployee = async (req, res) => {
  try {
    const result = await employeeService.editEmployee(req.params.id, req.body);
    console.log(result);
    if (!result) {
      return Responses.failResponse(req, res, null, messages.updateFailedRecordNotFound, 200);
    }

    if (result?.isDuplicateEmail) {
      return Responses.failResponse(req, res, null, messages.duplicateEmail, 200);
    }

    return Responses.successResponse(req, res, result, messages.updateSuccess, 200);
  } catch (error) {
    console.log(error);
    return Responses.errorResponse(req, res, error);
  }
};


/**FUNC- TO VIEW SINGLE EMPLOYEE **/
const viewSingleEmployee = async (req, res) => {
  try {
    const result = await employeeService.viewSingleEmployee(req.params.id);
    console.log("viewSingleEmploye result", result);
    if (!result) {
      return Responses.failResponse(req, res, null, messages.recordsNotFound, 200);
    }
    return Responses.successResponse(req, res, result, messages.recordsFound, 200);
  } catch (error) {
    console.log(error);
    return Responses.errorResponse(req, res, error);
  }
};

/**FUNC- TO DEACTIVATE EMPLOYEE **/
const deactivateEmployee = async (req, res) => {
  try {
    console.log(req.params);
    const result = await employeeService.deactivateEmployee(req.params.id);
    if (!result) {
      return Responses.failResponse(req, res, null, messages.deleteFailedRecordNotFound, 200);
    }
    return Responses.successResponse(req, res, null, messages.deleteSuccess, 200);
  } catch (error) {
    console.log(error);
    return Responses.errorResponse(req, res, error);
  }
};

/**FUNC- TO DELETE EMPLOYEE **/
const deleteEmployee = async(req, res) =>{
  try {
    console.log(req.params);
    const result = await employeeService.deleteEmployee(req.params.id);
    if (!result) {
      return Responses.failResponse(req, res, null, messages.deleteFailedRecordNotFound, 200);
    }
    return Responses.successResponse(req, res, null, messages.deleteSuccess, 200);
  } catch (error) {
    console.log(error);
    return Responses.errorResponse(req, res, error);
  }
}

/**FUNC- TO LOGIN EMPLOYEE **/
const loginEmployee = async (req, res) => {
  try {
    const result = await employeeService.loginEmployee(req.body);
    if (!result.success) {
      return Responses.failResponse(req, res, null, messages.recordsNotFound, 200);
    }

    const employee = result.employee;
    const token = await authMiddleware.generateUserToken({ email: employee.email, role: employee.role });

    return Responses.successResponse(req, res, { employee, token }, messages.loginSuccess, 200);
  } catch (error) {
    return Responses.errorResponse(req, res, error);
  }
};


/**FUNC- TO SEND OTP **/
const sendOtpToEmployee = async (req, res) => {
  try {
    const result = await employeeService.sendOtp(req.body);
    if (!result.success) {
      return Responses.failResponse(req, res, null, result.message, 200);
    }
    return Responses.successResponse(req, res, null, result.message, 200);
  } catch (error) {
    console.log(error);
    return Responses.errorResponse(req, res, error);
  }
};


const loginWithOtp = async (req, res) => {
  try {
      const result = await employeeService.loginWithOtp(req.body);
      if (!result.success) {
          return Responses.failResponse(req, res, null, result.message, 200);
      }
      return Responses.successResponse(req, res, result.employee, messages.otpLogin, 200);
  } catch (error) {
      console.log(error);
      return Responses.errorResponse(req, res, error);
  }
};

const listEmployee = async (req, res) => {
  try {
    const result = await employeeService.listEmployee(req.body, req.query);
    console.log(result);
    if (result.totalCount === 0) {
      return Responses.failResponse(req, res, null, messages.recordsNotFound, 200);
    }
    return Responses.successResponse(req, res, result, messages.recordsFound, 200);
  } catch (error) {
    console.log(error);
    return Responses.errorResponse(req, res, error);
  }
};

module.exports = {
  createEmployee,
  editEmployee,
  viewSingleEmployee,
  deactivateEmployee,
  deleteEmployee,
  loginEmployee,
  sendOtpToEmployee,
  loginWithOtp,
  listEmployee
}