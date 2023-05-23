import { useEffect,useState } from "react"
import { Box, Stack ,Button, Typography} from "@mui/material";
import { Grid } from "@mui/material";
import { RevenueVsLaborCost } from "../components/RevenueVsLaborCost";
import { YesterdayAtAGlanceCard } from "../components/YesterdayAtAGlanceCard";
import styled from "@emotion/styled";

export function Dashboard(){
    let [revenueLaborPeriod, setRevenueLaborPeriod] = useState(7)
    let [revenueLabor, setRevenueLabor] = useState([])
    const PaperBox = styled(Box)`
    text-align: center;
        height: "100%";
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
    `;

    useEffect(()=>{
        const url = `${process.env.REACT_APP_API_URL}/revenues/${revenueLaborPeriod}/wages`;
        const response = fetch(url,{
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            },
        })
        .then(response=>response.json())
        .then(data=>{
            setRevenueLabor(data)
        })},[revenueLaborPeriod])

   

    return (
        <>
        <div>
            <Grid container spacing={3} direction="row" justifyContent="center" alignItems="center">
                <Grid item xs={6} sm={6} >
                    <PaperBox padding={2} height={"40vh"}>
                        <Box sx={{height:"10%"}}>
                        <Typography>Revenue vs Labor Cost</Typography>
                        </Box>
                        <Box sx={{height:"90%"}}>
                        <Stack spacing={2} direction={"row"}  justifyContent={"flex-end"}>
                            <Button  color="primary" size="small" onClick={(e)=>setRevenueLaborPeriod(7)} >7d</Button>
                            <Button color="primary" size="small" onClick={(e)=>setRevenueLaborPeriod(30)} >30d</Button>
                            </Stack>
                        <RevenueVsLaborCost data={revenueLabor}/>
                        </Box>
                        </PaperBox>
                </Grid>

                <Grid item xs={6} sm={6} >
                    <PaperBox height={"40vh"} >
                       <YesterdayAtAGlanceCard/>
                    </PaperBox>
                </Grid>

                <Grid item xs={6} sm={6}>
                    <Box padding={2}>
                        <Typography>Task goes here</Typography>
                        </Box>
                </Grid>

                <Grid item xs={6} sm={6}>
                    <Box padding={2}>
                        <Typography>Task goes here</Typography>
                    </Box>
                </Grid>



            </Grid>
            

        </div>
        
       </>

    )
}