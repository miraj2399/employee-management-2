import { Button } from '@mui/material';
import {EmployeeDataGrid} from '../components/EmployeeDataGrid';
import { useState,useEffect,useRef } from 'react';
import { TextField,Box } from "@mui/material";


export function Employees({employees,setEmployees}) {
    
    
    let [newEmployee,setNewEmployee] = useState([{
        "empId":"",
        "firstName":"",
        "lastName":"",
        "contact":"",
        "salary":""
    }]);

    const empIdRef = useRef(null);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const contactRef = useRef(null);
    const salaryRef = useRef(null)

    const handleKeyDown = (event, nextField) => {
        if(event.key === 'Enter') {
            switch(nextField) {
                case 'firstName':
                    firstNameRef.current.focus();
                    break;
                case 'lastName':
                    lastNameRef.current.focus();
                    break;
                case 'contact':
                    contactRef.current.focus();
                    break;
                case 'salary':
                    salaryRef.current.focus();
                    break;
                

                default:
                    break;
            }
        }
    }

    const handleChange = (event,field) => {
        setNewEmployee({
            ...newEmployee,
            [field]: event.target.value
        });
    }

    


    async function handleSubmit(){
        
        const url = `${process.env.REACT_APP_API_URL}/employees`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json'
            },
            body: JSON.stringify([newEmployee])
        });
        if(response.ok){
            const responseData = await response.json();
        
            setEmployees([...employees, responseData[0]]);
            setNewEmployee({
                "empId":"",
                "firstName":"",
                "lastName":"",
                "contact":"",
                "salary":""
            });
        }
        else{
            console.log("Error");
        }


    }


    useEffect(() => {
        async function fetchEmployees() {
            fetch(`${process.env.REACT_APP_API_URL}/employees`)
                .then(response => response.json())
                .then(data => {
                    setEmployees(data);
                    localStorage.setItem('employees', JSON.stringify(data));
                });
        }
        fetchEmployees();
        
    }, []);





    return (
        <>
            <EmployeeDataGrid employees={employees} setEmployees={setEmployees} />
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop:"15px"}}> 
                <TextField 
                    label="Employee ID" 
                    variant="outlined" 
                    value={newEmployee.empId} 
                    onChange={(e)=> handleChange(e, "empId")} 
                    inputRef={empIdRef} 
                    onKeyDown={(e)=>handleKeyDown(e, 'firstName')}
                />
                <TextField 
                    label="First Name" 
                    variant="outlined" 
                    value={newEmployee.firstName} 
                    onChange={(e)=>handleChange(e, "firstName")} 
                    inputRef={firstNameRef} 
                    onKeyDown={(e)=>handleKeyDown(e, 'lastName')}
                />
                <TextField 
                    label="Last Name" 
                    variant="outlined" 
                    value={newEmployee.lastName} 
                    onChange={(e)=>handleChange(e, "lastName")} 
                    inputRef={lastNameRef} 
                    onKeyDown={(e)=>handleKeyDown(e, 'contact')}
                />
                <TextField 
                    label="Contact" 
                    variant="outlined" 
                    value={newEmployee.contact} 
                    onChange={(e)=> handleChange(e, "contact")} 
                    inputRef={contactRef} 
                    onKeyDown={(e)=>handleKeyDown(e, 'salary')}
                />
                <TextField 
                    label="Salary" 
                    variant="outlined" 
                    value={newEmployee.salary} 
                    onChange={(e)=>handleChange(e, "salary")} 
                    inputRef={salaryRef} 
                    onKeyDown={(e)=>handleKeyDown(e, 'submit')}
                />
                <Button variant="contained" color="primary" onClick={handleSubmit}>Add</Button>
            </Box>
        </>
    );

}
