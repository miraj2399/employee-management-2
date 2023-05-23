express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var cors = require('cors');

//write middleware to toatl number of requests made to the server
var count = 0;
app.use((req,res,next)=>{
    console.log("Request number: ", count++);
    next();
}
)




const corsOptions ={
    origin:'*', 
    credentials:true,
}
 
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const Employee = require("./models/employeeModel")
const ClockRecord = require("./models/ClockRecordModel")
const Revenue = require("./models/RevenueModel")

mongoose.connect("mongodb://localhost/subscribers")
.then(()=>{
    app.listen(3000, ()=>{
        console.log("Server started here")
    })
    console.log("Connected to db")
}).catch((error)=>console.log(error))


app.get("/employees",async(req,res)=>{
    try{
        const employees = await Employee.find()
        console.log("Got employees");
        res.status(200).json(employees)
    } catch(error){
        console.log(error.message)
        res.status(500).json({message: "Cannnot get employees", details: error.message})
    }
})

app.get("/employees/:empId",async (req,res)=>{
    try{
        const id = parseInt(req.params.empId);
        
        const employee = await Employee.findOne({empId:id});
       
        return res.status(200).json(employee)
    } catch(error){
        res.status(500).json({message: "Cannnot get employees", details: error.message})
    }
})

app.post("/employees", async (req,res)=>{
    try{
        
        var employees = req.body;
        
        var addedEmployees = await Promise.all(employees.map(async employee => {
            const newEmployee = await Employee.create(employee);
            return newEmployee;
        }));

        return res.status(200).json(addedEmployees)
    } catch(error){
        console.log(error.message)
       return res.status(400).json({"message":"Cannot proceed request","details":error.message})
    }
})

app.delete("/employees",async (req,res)=>{
    console.log("request to DELETE employees")
    console.log(req.body)
    try{
        var employees = req.body;
        var deletedEmployees = await Promise.all(employees.map(async employee => {
            const deletedEmployee = await Employee.findOneAndDelete({empId:employee.empId});
            if (deletedEmployee == null){
                throw new Error("Employee not found")
            }
            return deletedEmployee;
        }));
        // delete relate clock records
        await ClockRecord.deleteMany({empId:{$in:employees.map(employee=>employee.empId)}})
        return res.status(200).json(deletedEmployees)
    }
    catch(error){
        console.log(error.message)
        res.status(500).json({message: "Cannnot get employees", details: error.message})
    }
})

app.put("/employees",async (req,res)=>{
    try{
        var employees = req.body;
        var updatedEmployees = await Promise.all(employees.map(async employee => {
            const updatedEmployee = await Employee.findOneAndUpdate({empId:employee.empId},employee,{new:true});
            if (updatedEmployee == null){
                throw new Error("Employee not found")
            }
            return updatedEmployee;
        }));
        return res.status(200).json(updatedEmployees)
    }
    catch(error){
        console.log(error.message)
        res.status(500).json({message: "Cannnot get employees", details: error.message})
    }
}   )





/*
[
    {
        _id:xxxxxx,
        clockIn:"0630",
        clockOut:"0124",
        reportDate: "011323"(mmddyy)
    },

]
*/

function createDate(dateString, timeString) {
    // Extract the parts of the date
    const month = dateString.substring(0, 2);
    const day = dateString.substring(2, 4);
    const year = "20" + dateString.substring(4, 6);  // Assume it's in 21st century

    // Extract the parts of the time
    let hour, minute;
    if (timeString.length === 4) {
        hour = timeString.substring(0, 2);
        minute = timeString.substring(2, 4);
    } else if (timeString.length === 3) {
        hour = timeString.substring(0, 1);
        minute = timeString.substring(1, 3);
    } else {
        throw new Error("Invalid time format");
    }

    // Create a new Date object
    const date = new Date(year, month - 1, day, hour, minute);
   
    return date;
}
/*
app.post("/clockrecords", async(req,res)=>{
    try{
        var records = req.body;
        var addedRecords = await Promise.all(records.map(async record => {
            const formattedRecord = {}
            let clockInTime = createDate(record.reportDate,record.clockIn)
            let clockOutTime = createDate(record.reportDate,record.clockOut)
            if (clockOutTime < clockInTime) {
                clockOutTime = new Date(clockOutTime.getTime() + 24*60*60*1000);  // Add 24 hours
            }
            formattedRecord.clockIn = clockInTime
            formattedRecord.clockOut = clockOutTime
            formattedRecord.employee = record._id;
            const newRecord = await ClockRecord.create(formattedRecord);
            return newRecord;
        }));

        return res.status(200).json(addedRecords)
    } catch(error){
        console.log(error.message)
       return res.status(400).json({"message":"Cannot proceed request","details":error.message})
    }
})
*/

app.post("/clockrecords", async (req, res) => {
    try {
        var records = req.body;
        var addedRecords = await Promise.all(records.map(async record => {
            const formattedRecord = {}
            let clockInTime = createDate(record.reportDate, record.clockIn)
            let clockOutTime = createDate(record.reportDate, record.clockOut)
            if (clockOutTime < clockInTime) {
                clockOutTime = new Date(clockOutTime.getTime() + 24 * 60 * 60 * 1000);  // Add 24 hours
            }
            formattedRecord.clockIn = clockInTime
            formattedRecord.clockOut = clockOutTime
            formattedRecord.employee = record.id;

            const overlappingRecords = await ClockRecord.find({
                employee: record.id,
                $or: [
                    { clockIn: { $lt: clockOutTime }, clockOut: { $gt: clockInTime } },  // overlaps the new record
                    { clockIn: { $lte: clockInTime }, clockOut: { $gte: clockOutTime } } // completely covers the new record
                ]
            });

            if (overlappingRecords.length > 0) {
                throw new Error(`Cannot add record for clockIn time ${record.clockIn} and clockOut time ${record.clockOut}, because it overlaps with an existing record.`);
            }

            const newRecord = await ClockRecord.create(formattedRecord);
            return newRecord;
        }));

        return res.status(200).json(addedRecords)
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({ "message": "Cannot proceed request", "details": error.message })
    }
})

// get the clock records of non deleted employees
app.get("/clockrecords",async(req,res)=>{
    try{
        // return record of _id, empId, clockIn,clockOut,clockTime,wageAccured


        console.log("get clock records")
        var records = await ClockRecord.find({}).populate("employee");
        
        records = records.map(record=>{
            const formattedRecord = {}
            formattedRecord._id = record._id
            formattedRecord.id = record.id
            formattedRecord.empId = record.employee.empId
            formattedRecord.clockIn = record.clockIn
            formattedRecord.clockOut = record.clockOut
            // clock Time in hh:mm format
            const cTime = Math.round((record.clockOut - record.clockIn) / 1000 / 60)
            formattedRecord.clockTime = `${Math.floor(cTime / 60)}:${cTime % 60}`
            // two decimal places
            formattedRecord.wageAccured = (record.employee.salary * cTime / 60).toFixed(2)
            return formattedRecord
        })
        return res.status(200).json(records)
        
    } catch(error){
        res.status(500).json({message: "Cannnot get employees", details: error.message})
    }

    

})
// delete arrays of clock records
app.delete("/clockrecords",async(req,res)=>{
    console.log("request to DELETE clock records")
    /*
    [
  {
    _id: '646af0ac11475d593bf8bb38',
    id: '646af0ac11475d593bf8bb38',
    empId: 1,
    clockIn: '2023-05-22T06:23:00.000Z',
    clockOut: '2023-05-22T08:57:00.000Z',
    clockTime: '2:34',
    wageAccured: '59.03'
  }
]
    */
    console.log(req.body)
    try{
        const deletedRecords = await Promise.all(req.body.map(async record=>{
            const deletedRecord = await ClockRecord.findByIdAndDelete(record._id)
            return deletedRecord
        }))
        return res.status(200).json(deletedRecords)
    } catch(error){ 
        res.status(500).json({message: "Cannot delete records", details: error.message})
    }
})

// revenues will recieve a date in mmddyy format and return the total revenue for that day
app.get("/revenues",async(req,res)=>{
    try{
        const records = await Revenue.find({})
        return res.status(200).json(records)
    } catch(error){
        res.status(500).json({message: "Cannot find revenues", details: error.message})
    }
})

app.post("/revenues",async(req,res)=>{
    try{
        const newRevenue = await Revenue.create({date: createDate( req.body.date,"0000"),revenue: req.body.revenue})
        return res.status(200).json(newRevenue)
    } catch(error){
        res.status(500).json({message: "Cannot create revenue", details: error.message})
    }
})

app.get("/revenues/:days",async(req,res)=>{
    try{
        const days = req.params.days
        const records = await Revenue.find({}).sort({date: -1}).limit(days)
        return res.status(200).json(records)
    } catch(error){
        res.status(500).json({message: "Cannot find revenues", details: error.message})
    }
}
)

// get last x reported revenues and the total wage accured for that day
app.get("/revenues/:days/wages",async(req,res)=>{
    try{
        const days = req.params.days
        const records = await Revenue.find({}).sort({date: -1}).limit(days)
        const employees = await Employee.find({})
        const wagesByDate = {}
        for (let i = 0; i < records.length; i++){
            wagesByDate[records[i].date.toDateString()] = 0
        }
        for (let i = 0; i < employees.length; i++){
            const employee = employees[i]
            const clockRecords = await ClockRecord.find({employee: employee._id})
            for (let j = 0; j < clockRecords.length; j++){
                const clockRecord = clockRecords[j]
                const date = clockRecord.clockIn.toDateString()
                if (wagesByDate[date] !== undefined){
                    const cTime = Math.round((clockRecord.clockOut - clockRecord.clockIn) / 1000 / 60)
                    wagesByDate[date] += employee.salary * cTime / 60
                }
            }
        }

        const wagesByDateArr = []
        for (let i = 0; i < records.length; i++){
            const date = records[i].date.toDateString()
            wagesByDateArr.push({date: date, wage: wagesByDate[date], revenue: records[i].revenue})
        }
        return res.status(200).json(wagesByDateArr)
    } catch(error){
       return res.status(500).json({message: "Cannot find revenues", details: error.message})
    }
})