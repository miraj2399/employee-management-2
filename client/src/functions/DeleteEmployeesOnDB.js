import { BASE_URL } from "./Settings";
export async function DeleteEmployeesOnDB(employee){
    const url = `${BASE_URL}/employees`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept' : 'application/json'
        },
        body: JSON.stringify(employee)
    });
    if(response.ok){
        return true;
    }
    else{
        return false;
    }
}