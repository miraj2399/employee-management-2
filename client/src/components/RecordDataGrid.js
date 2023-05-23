import * as React from 'react';
import { DataGrid, useGridApiContext } from '@mui/x-data-grid';

import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import {  Grid } from '@mui/material';
import moment from 'moment';



const useFakeMutation = () => {
  return React.useCallback(
    (user) =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (user.firstName?.trim() === ''|| user.lastName?.trim() === '' || user.contact?.trim() === '' || user.salary.toString()?.trim() === '') {
            reject();
          } else {
            async function UpdateEmployeesToDB(employee){
                const url = `${process.env.REACT_APP_API_URL}/employees`;
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept' : 'application/json'
                    },
                    body: JSON.stringify(employee)
                });
                if(response.ok){
                    return response.json();
                }
                throw response;
            }
            UpdateEmployeesToDB([user]);
            resolve(user);
          }
        }, 200);
      }),
    [],
  );
};

/*
formattedRecord._id = record._id
            formattedRecord.id = record.id
            formattedRecord.empId = record.employee.empId
            formattedRecord.clockIn = record.clockIn
            formattedRecord.clockOut = record.clockOut
            formattedRecord.clockTime = `${Math.floor(cTime / 60)}:${cTime % 60}`
            // two decimal places
            formattedRecord.wageAccured = (record.employee.salary * cTime / 60).toFixed(2)
*/
function computeMutation(newRow, oldRow) {
    if (newRow.empId !== oldRow.empId) {
        return `empId from ${oldRow.empId} to ${newRow.empId}`;
    }
    if (newRow.clockIn !== oldRow.clockIn) {
        return `clockIn from ${oldRow.clockIn} to ${newRow.clockIn}`;
    }
    if (newRow.clockOut !== oldRow.clockOut) {
        return `clockOut from ${oldRow.clockOut} to ${newRow.clockOut}`;
    }
    if (newRow.clockTime !== oldRow.clockTime) {
        return `clockTime from ${oldRow.clockTime} to ${newRow.clockTime}`;
    }
    if (newRow.wageAccured !== oldRow.wageAccured) {
        return `wageAccured from ${oldRow.wageAccured} to ${newRow.wageAccured}`;
    }
    

  return null;
}

export  function RecordDataGrid({records:rows,setRecords}) {
    
  const mutateRow = useFakeMutation();
  const yesButtonRef = React.useRef(null);
  const [promiseArguments, setPromiseArguments] = React.useState(null);

  const [snackbar, setSnackbar] = React.useState(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const processRowUpdate = React.useCallback(
    (newRow, oldRow) =>
      new Promise((resolve, reject) => {
       
        const mutation = computeMutation(newRow, oldRow);
        if (mutation) {
          // Save the arguments to resolve or reject the promise later
          setPromiseArguments({ resolve, reject, newRow, oldRow });
        } else {
          resolve(oldRow); // Nothing was changed
        }
      }),
    [],
  );

  const handleNo = () => {
    const { oldRow, resolve } = promiseArguments;
    resolve(oldRow); // Resolve with the old row to not update the internal state
    setPromiseArguments(null);
  };

  const handleYes = async () => {
    const { newRow, oldRow, reject, resolve } = promiseArguments;

    try {
      // Make the HTTP request to save in the backend
      const response = await mutateRow(newRow);
      setSnackbar({ children: 'User successfully saved', severity: 'success' });
      resolve(response);
      setPromiseArguments(null);
    } catch (error) {
      setSnackbar({ children: "Field can't be empty", severity: 'error' });
      reject(oldRow);
      setPromiseArguments(null);
    }
  };

  const handleEntered = () => {
    // The `autoFocus` is not used because, if used, the same Enter that saves
    // the cell triggers "No". Instead, we manually focus the "No" button once
    // the dialog is fully open.
     yesButtonRef.current?.focus();
  };
  const renderConfirmDialog = () => {
    if (!promiseArguments) {
      return null;
    }

    const { newRow, oldRow } = promiseArguments;
    const mutation = computeMutation(newRow, oldRow);

   
   
    

    return (
      <Dialog
        maxWidth="xs"
        TransitionProps={{ onEntered: handleEntered }}
        open={!!promiseArguments}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent dividers>
          {`Pressing 'Yes' will change ${mutation}.`}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNo}>
            No
          </Button>
          <Button ref ={yesButtonRef} onClick={handleYes}>Yes</Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  
  const [selectionModel, setSelectionModel] = React.useState([]);
  const handleSelection = (newSelectionModel) => {
    setSelectionModel(newSelectionModel);
  };
 

  return (
     <Grid  container spacing={2} marginTop={1}  >
    <Grid item xs={12} minHeight={"50px"} >
    {selectionModel.length>0 && 
    <Button size='small' variant="contained" color="primary" onClick={() => {
      const selectedRecords = rows.filter((row) => selectionModel.includes(row.id));
      fetch(`${process.env.REACT_APP_API_URL}/clockrecords`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept' : 'application/json'
        },
        body: JSON.stringify(selectedRecords)
      }).then((response) => {
        if(response.ok){
          setRecords(rows.filter((row) => !selectionModel.includes(row.id)));
          setSelectionModel([]);
          setSnackbar({ children: 'Records successfully deleted', severity: 'success' });
        }
      }
      )


    }}>Delete</Button>}
    </Grid>

    <Grid item xs={12} maxHeight={"80vh"}>
      {renderConfirmDialog()}
      <DataGrid  rows={rows} columns={columns} processRowUpdate={processRowUpdate} checkboxSelection onRowSelectionModelChange={handleSelection}
      pageSizeOptions={[5, 10, 25,50,100]} />
      {!!snackbar && (
        <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
      </Grid>
    </Grid>
  );
}




const columns = [
    {field: 'empId', headerName: 'Employee ID', width: 180, editable: false},
    {field: 'clockIn', type: 'date',
    valueFormatter: params => 
    moment(params?.value).format("DD/MM/YYYY HH:mm"),
    headerName: 'Clock In', width: 180, editable: false},
    {field: 'clockOut',type: 'date',
    valueFormatter: params => 
    moment(params?.value).format("DD/MM/YYYY HH:mm"),
     headerName: 'Clock Out', width: 180, editable: false},
    {field: 'clockTime', headerName: 'Time worked', width: 180, editable: false},
    {field: 'wageAccured', headerName: 'Wage Accured', width: 180, editable: false}
];
