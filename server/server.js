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

const Employee = require("./models/employeeModel")

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
        console.log(typeof(id))
        const employee = await Employee.findOne({empId:id});
        console.log(employee)
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
    try{
        var employees = req.body;
        var deletedEmployees = await Promise.all(employees.map(async employee => {
            const deletedEmployee = await Employee.findOneAndDelete({empId:employee.empId});
            if (deletedEmployee == null){
                throw new Error("Employee not found")
            }
            return deletedEmployee;
        }));
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