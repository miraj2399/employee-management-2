import { useEffect,useState } from "react"

import { RecordDataGrid } from "../components/RecordDataGrid";

export function Records(){
    const [records, setRecords] = useState([])

    useEffect(()=>{
        const url = `${process.env.REACT_APP_API_URL}/clockrecords`;
        const response = fetch(url,{
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            }
        });
        response.then((response)=>{
            return response.json();
        }).then((records)=>{
            setRecords(records);
        }).catch((error)=>{
            alert(error);
        }
        )
    },[])

    return (
        <div>
            <RecordDataGrid records={records} setRecords={setRecords}/>
        </div>
    )
}