import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

export const  YesterdayAtAGlanceCard = () => {
  // Dummy data for employees' clock-in, clock-out, and wage
 

  return (
    <Card sx={{height:"100%"}}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Yesterday at a Glance
        </Typography>
        <Typography variant="body1" gutterBottom>
          Revenue: $1500
          <br />
          Up/Down 10% from the day before (revenue)
        </Typography>
        <Typography variant="body1" gutterBottom>
          Labor Cost: $500
          <br />
          Up/Down 5% from the day before (labor cost)
        </Typography>
        
      </CardContent>
    </Card>
  );
};


