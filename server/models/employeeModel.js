const mongoose = require("mongoose")
const { Schema } = mongoose;

const employeeSchema = new Schema({
    empId: {
        type: Number,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    contact: {
        type: String
    },
    salary: {
        type: Number,
        default: 14.13
    }

}, {
    toJSON: {
        virtuals: true, // ensure virtual fields are included in toJSON output
    },
    toObject: {
        virtuals: true, // ensure virtual fields are included in toObject output
    }
});

employeeSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

employeeSchema.index({empId:1});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
