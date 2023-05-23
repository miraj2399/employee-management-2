const mongoose = require("mongoose");
const Employee = require("./employeeModel");

const clockRecordSchema = mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },
    clockIn: {
      type: Date,
      require: true
    },
    clockOut: {
      type: Date,
      require: true
    }
  },
  {
    toJSON: { virtuals: true }, // This option includes virtuals in the JSON response
    toObject: { virtuals: true } // This option includes virtuals when converting the document to a plain object using .toObject()
  }
);

// Create a virtual property 'id' that's computed from '_id'.
clockRecordSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are included when converting to JSON/objects
clockRecordSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

const ClockRecord = mongoose.model("ClockRecord", clockRecordSchema);

module.exports = ClockRecord;
