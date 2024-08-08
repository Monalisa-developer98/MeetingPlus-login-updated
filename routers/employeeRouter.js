const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const validator = require("../validators/employeeValidator");
const authMiddleware = require("../middlewares/authMiddleware");

router.post('/createEmployee', validator.createEmployeeValidator, employeeController.createEmployee);
/* EDIT EMPLOYEE  */
router.put("/editEmployee/:id", validator.editEmployeeValidator, employeeController.editEmployee);
/* VIEW SINGLE EMPLOYEE  */
router.get("/viewSingleEmployee/:id", validator.viewSingleEmployeeValidator, 
    authMiddleware.verifyUserToken,
    employeeController.viewSingleEmployee
);

/* VIEW EMPLOYEE  */
router.post("/listEmployee", authMiddleware.verifyUserToken, employeeController.listEmployee);

/* DEACTIVATE EMPLOYEE  */
router.put("/deactivateEmployee/:id", validator.deactivateEmployeValidator, employeeController.deactivateEmployee);
/* DELETE EMPLOYEE  */
router.delete("/deleteEmployee/:id", validator.deleteEmployeValidator, employeeController.deleteEmployee);

// login with email and password
router.post('/login', validator.loginSchema, employeeController.loginEmployee);

router.post('/send-otp', validator.sendOtpSchema, employeeController.sendOtpToEmployee);

router.post('/login/otp', validator.loginOtpSchema, employeeController.loginWithOtp);

module.exports = router;