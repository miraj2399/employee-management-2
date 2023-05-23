import { Typography } from '@mui/material';
import React from 'react';
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, Legend, ResponsiveContainer } from 'recharts';

export const RevenueVsLaborCost = ({ data }) => {
  return (
    <>
    <ResponsiveContainer width="100%" height="90%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="wage" stackId="1" stroke="#8884d8" fill="#8884d8" />
        <Area type="monotone" dataKey="revenue" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
      </AreaChart>
    </ResponsiveContainer>
    </>
  );
};

