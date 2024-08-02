const mongoose = require('mongoose');
const validator = require('validator');
const employeeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        index:true,     
    },
    email: {
        type: String,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email. Please enter a valid email'
        },
        default: null,
        required: true,
        unique: true,
        index: true
    }, 
    password: {
        type: String,
        required: true,
    },
    otp: {
        type: String
    },
    otpExpiry: { type: Date },
    isActive: {
        type: Boolean,
        default: true,
        index: true,
        required: true,
    },    
},{
    timestamps: true,
})

const Employee = mongoose.model("employees", employeeSchema);

module.exports = Employee;