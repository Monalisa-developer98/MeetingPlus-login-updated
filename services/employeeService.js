const Employee = require('../models/employeeModel');
const ObjectId = require('mongoose').Types.ObjectId;
const emailService = require("./emailService");
const { generateOTP } = require('./otpService');
const messages = require("../constants/constMessages");
const { generetHashPassword, verifyPassword } = require('../helpers/commonHelper');

// create Employee
const createEmployee = async(data) => {
    console.log("----------3333", data);
    const emailDetails = await checkDuplicateEmail(data.name);
    console.log("Email Details", emailDetails);

    if (emailDetails){
        return {
           isDuplicateEmail: true,
        }
    }

    const hashedPassword = await generetHashPassword(data.password);

    if(!emailDetails){
        const inputData = {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role,
            designation: data.designation,
            department: data.department
        }
        const empData = new Employee(inputData);
        const result = await empData.save();
        return result;
    }
    return false;
};

const checkDuplicateEmail = async (email) => {
    console.log("email---------------", email);
    return await Employee.findOne(
      { email, isActive: true },
      { _id: 1, email: 1, name: 1, isActive: 1 }
    );
};

const checkDuplicateEntry = async (email) => {
    const emailDetails = await Employee.findOne({ email });
    return [emailDetails];
};

/**FUNC- TO VERIFY ACTIVE USER*/
const verifyEmployee = async (email) => {
    console.log("empId-----------", email);
    return await Employee.findOne(
      { email, isActive: true },
      {
        _id: 1,
        email: 1,
        name: 1,
        role: 1,
        isActive: 1,
      }
    );
};

/**FUNC- TO SEE LIST OF EMPLOYEE */
const listEmployee = async (bodyData, queryData) => {
    const { order } = queryData;
    const { searchKey } = bodyData;
  
    let query = searchKey 
        ? {
            $and: [
                {
                    $or: [
                        { name: { $regex: searchKey, $options: "i" } },
                        { email: { $regex: searchKey, $options: "i" } },
                    ],
                },
                {
                    isActive: true,
                },
            ],
        }
        : { isActive: true };
  
    const limit = queryData.limit ? parseInt(queryData.limit) : 0;
    const skip = queryData.page ? (parseInt(queryData.page) - 1) * limit : 0;
  
    const totalCount = await Employee.countDocuments(query);
    const employeeData = await Employee.find(query).sort({ _id: parseInt(order) }).skip(skip).limit(limit);

    console.log("EMp data--&**&", employeeData);
  
    return { totalCount, employeeData };
};


/**FUNC- EDIT EMPLOYEE */
const editEmployee = async (id, data) => {
    console.log("Data received for update:", data);
    console.log("Employee ID:", id);
  
    const [emailDetails] = await checkDuplicateEntry(data.email);
  
    if (emailDetails && emailDetails._id.toString() !== id) {
      return {
        isDuplicateEmail: true,
      };
    }
    // Hash the password if it is being updated
    if (data.password) {
        data.password = await generetHashPassword(data.password);
    }

    const result = await Employee.findByIdAndUpdate({ _id: id }, data, { new: true,});
    return result;
};

/**FUNC- TO SEE SINGLE EMPLOYE DETAILS */
const viewSingleEmployee = async (id) => {
    const singleEmployeDetails = await Employee.findById({_id: id, isActive: true });
    console.log("single employee", singleEmployeDetails);
    return singleEmployeDetails;
};

/**FUNC- TO DEACTIVATE AN EMPLOYEE ----> sets isactive true to false*/
const deactivateEmployee = async (id) => {
    console.log("id--->>", id);
    const result = await Employee.findByIdAndUpdate({_id: id},{isActive: false},{new: true});  
    return result;
};


/**FUNC- TO DELETE  AN EMPLOYEE*/
const deleteEmployee = async (id) => {
    console.log("id--->>", id);
    const result = await Employee.findByIdAndDelete(id);  
    return result;
};

/**FUNC- TO LOGIN WITH PASSWORD */
const loginEmployee = async (data) => {
    const employee = await Employee.findOne({ email: data.email, isActive: true });
    if (!employee) {
        return {
            message: "Employee not found",
            success: false
        };
    }
    
    const isPasswordValid = await verifyPassword(data.password, employee.password);
    if (!isPasswordValid) {
        return {
            message: "Invalid password",
            success: false
        };
    }
    return {
        success: true,
        employee
    };
};

const sendOtp = async (data) => {
    const employee = await Employee.findOne({ email: data.email, isActive: true });
    if (!employee) {
      return {
        message: "Employee not found",
        success: false
      };
    }
  
    const otp = generateOTP();
    employee.otp = otp;
    employee.otpExpiry = new Date(Date.now() + 15 * 60 * 1000); 
    await employee.save();
  
    const emailSubject = 'Your OTP for Verification';
    const mailData = `<p>Your OTP for verification is <strong>${otp}</strong>. It will expire in 15 minutes.</p>`; // Define the email body

    // Send OTP email
    await emailService.sendEmail(employee.email, emailSubject, mailData);
  
    return {
      message: "OTP sent successfully",
      success: true
    };
};

const loginWithOtp = async (data) => {
    const { email, otp } = data;
    const employee = await Employee.findOne({ email, isActive: true });
    if (!employee) {
        return {
            message: "Employee not found",
            success: false
        };
    }
    const otpRecord = await Employee.findOne({ email: employee.email, otp });
    if (!otpRecord) {
        return {
            message: "Invalid OTP",
            success: false
        };
    }
    if (new Date() > otpRecord.otpExpiry) {
        return {
            message: messages.expiredOtp,
            success: false
        };
    }
    return { success: true, employee };
};
  
module.exports = {
    createEmployee,
    editEmployee,
    verifyEmployee,
    viewSingleEmployee,
    deactivateEmployee,
    deleteEmployee,
    loginEmployee,
    sendOtp,
    loginWithOtp,
    listEmployee
}