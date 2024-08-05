const Joi = require('joi');
const Responses = require("../helpers/response");

//CREATE EMPLOYEE VALIDATOR
const createEmployeeValidator = async (req, res, next) => {
    try {
      console.log("Body-->", req.body);
      const bodySchema = Joi.object({
        name: Joi.string().trim().pattern(/^[0-9a-zA-Z ,/-]+$/)
          .messages({
            "string.pattern.base": `HTML tags & Special letters are not allowed!`,
        }),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
            .messages({
            'string.min': 'Password should have a minimum length of {#limit}',
            'string.empty': 'Password cannot be an empty field',
            'any.required': 'Password is a required field'
        })       
      });
      console.log("bodySchema--", bodySchema);
      await bodySchema.validateAsync(req.body);
  
      next();
    } catch (error) {
      console.log(error);
      return Responses.errorResponse(req, res, error, 200);
    }
};

// EDIT EMPLOYEE VALIDATOR
const editEmployeeValidator = async (req, res, next) => {
    try {
      console.log(req.body);
      console.log(req.params);

      const bodySchema = Joi.object({
        name: Joi.string().trim().pattern(/^[0-9a-zA-Z ,/-]+$/)
        .messages({
            "string.pattern.base": `HTML tags & Special letters are not allowed!`,
          }),
        email: Joi.string().email(),
       
      });
      console.log("bodySchema--", bodySchema);
      const paramsSchema = Joi.object({
        id: Joi.string().trim().alphanum().required(),
      });
      await paramsSchema.validateAsync(req.params);
      await bodySchema.validateAsync(req.body);
  
      next();
    } catch (error) {
      console.log(error);
      errorLog(error);
      return Responses.errorResponse(req, res, error, 200);
    }
  };

//VIEW EMPLOYEE VALIDATOR
const viewSingleEmployeeValidator = async (req, res, next) => {
    try {
      console.log(req.body);
      console.log(req.params);
      const paramsSchema = Joi.object({
        id: Joi.string().trim().alphanum().required(),
      });
      await paramsSchema.validateAsync(req.params);
      next();
    } catch (error) {
      console.log(error);
      errorLog(error);
      return Responses.errorResponse(req, res, error, 200);
    }
};

//DEACTIVATE EMPLOYEE VALIDATOR
const deactivateEmployeValidator = async (req, res, next) => {
    try {
      const paramsSchema = Joi.object({
        id: Joi.string().trim().alphanum().required(),
      });
      await paramsSchema.validateAsync(req.params);
      next();
    } catch (error) {
      console.log(error);
      errorLog(error);
      return Responses.errorResponse(req, res, error);
    }
};

//DELETE EMPLOYEE VALIDATOR
const deleteEmployeValidator = async (req, res, next) => {
    try {
      const paramsSchema = Joi.object({
        id: Joi.string().trim().alphanum().required(),
      });
      await paramsSchema.validateAsync(req.params);
      next();
    } catch (error) {
      console.log(error);
      errorLog(error);
      return Responses.errorResponse(req, res, error);
    }
};

//LOGIN EMPLOYEE VALIDATOR
const loginSchema = async (req, res, next) => {
  try {
    const bodySchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
          .messages({
          'string.min': 'Password should have a minimum length of {#limit}',
          'string.empty': 'Password cannot be an empty field',
          'any.required': 'Password is a required field'
      })       
    });
    await bodySchema.validateAsync(req.body);
    next();
  } catch (error) {
    console.log(error);
    return Responses.errorResponse(req, res, error, 200);
  }
}

const sendOtpSchema = async(req, res, next) =>{
  try {
    const bodySchema = Joi.object({
      email: Joi.string().email().required()      
    });
    await bodySchema.validateAsync(req.body);
    next();
  } catch (error) {
    console.log(error);
    return Responses.errorResponse(req, res, error, 200);
  }
}

const loginOtpSchema = async(req, res, next) => {
  try {
    const bodySchema = Joi.object({
      email: Joi.string().email().required(),
      otp: Joi.string().min(6).required()   
    });
    await bodySchema.validateAsync(req.body);
    next();
  } catch (error) {
    console.log(error);
    return Responses.errorResponse(req, res, error, 200);
  }
}

//LSIT EMPLOYEE VALIDATOR
const listEmployesValidator = async (req, res, next) => {
  try {
    const bodySchema = Joi.object({
      searchKey: Joi.string()
        .trim()
        .pattern(/^[0-9a-zA-Z ,/-]+$/)
        .messages({
          "string.pattern.base": `HTML tags & Special letters are not allowed!`,
        }),
    });
    const paramsSchema = Joi.object({
      limit: Joi.number(),
      page: Joi.number(),
      order: Joi.number(),
    });
    await bodySchema.validateAsync(req.body);
    await paramsSchema.validateAsync(req.query);

    next();
  } catch (error) {
    console.log(error);
    errorLog(error);
    return Responses.errorResponse(req, res, error, 200);
  }
};

module.exports = {
    createEmployeeValidator,
    editEmployeeValidator,
    viewSingleEmployeeValidator,
    deactivateEmployeValidator,
    deleteEmployeValidator,
    loginSchema,
    sendOtpSchema,
    loginOtpSchema,
    listEmployesValidator
}