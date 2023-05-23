// RevenueModel will have a date field and number field for each day


const mongoose = require("mongoose");
const RevenueSchema = mongoose.Schema(
    {
        date: {
            type: Date,
            require: true
        },
        revenue: {
            type: Number,
            require: true
        }
    },
    {
        toJSON: { virtuals: true }, // This option includes virtuals in the JSON response
        toObject: { virtuals: true } // This option includes virtuals when converting the document to a plain object using .toObject()
    }
);

// Create a virtual property 'id' that's computed from '_id'.
RevenueSchema.virtual("id").get(function () {
    return this._id.toHexString();
}
);


module.exports = mongoose.model("Revenue", RevenueSchema);