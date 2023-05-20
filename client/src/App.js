import {AppBar, Toolbar,ListItem, Paper, Button, IconButton, CssBaseline, ListItemButton, ListItemIcon,List,Drawer,Box,ListItemText, Typography, Grid, Stack} from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import {styled, createTheme} from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {Route,Routes,Link} from 'react-router-dom';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';


import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { Employees } from './pages/Employees';
import { Reports } from './pages/Reports';





const theme = createTheme({
  
});

const drawerWidth=240;
const Main = styled(Box,{ shouldForwardProp: (prop) => prop !== 'drawerOpen' })(({ theme, drawerOpen }) => ({
  
  marginLeft: drawerOpen? `${drawerWidth}px` : '0px',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
}));



function App() {


  let [drawerOpen, setDrawerOpen] = useState(false);
  let toggleDrawerOpen = () =>{
    setDrawerOpen(!drawerOpen);
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="sticky">
          <Toolbar>
            <Grid container justifyContent="space-between"> 
              <Grid>
                <IconButton onClick={toggleDrawerOpen}>
                  <MenuIcon  />
                </IconButton>
              </Grid>

              <Grid>
                <Stack direction="row" spacing={2}>
                  <Button variant='contained'>Login</Button>
                  <Button variant='contained'>Register</Button>
                </Stack>
              </Grid>
            </Grid>
            </Toolbar>
        </AppBar>


        <Drawer open={drawerOpen} variant="persistent">

          

          <Box sx={{
            width:drawerWidth,
            height:"100%",
            display:"flex",
            flexDirection:"column",
            justifyContent:"space-between"

            
            



          }}>

            <Box >
              <List>
                <ListItem>
                 <ListItemButton onClick={toggleDrawerOpen}>
                    <ListItemIcon><ChevronLeftIcon/></ListItemIcon>
                 </ListItemButton>

                </ListItem>

                <ListItem>
                  <ListItemButton component={Link} to="/">
                    <ListItemIcon><DashboardIcon/></ListItemIcon>
                    <ListItemText>Dashboard</ListItemText>
                  </ListItemButton>
                </ListItem>

                <ListItem>
                  <ListItemButton component={Link} to="/employees">
                    <ListItemIcon><PeopleIcon/></ListItemIcon>
                    <ListItemText>Employes</ListItemText>
                  </ListItemButton>
                </ListItem>

                <ListItem>
                  <ListItemButton component={Link} to="/reports">
                    <ListItemIcon><BarChartIcon/></ListItemIcon>
                    <ListItemText>Reports</ListItemText>
                  </ListItemButton>
                </ListItem>

              </List>
            </Box>
            
            <Paper>
              <List>

                <ListItem>
                  <ListItemButton component={Link} to="/settings">
                    <ListItemIcon><SettingsIcon/></ListItemIcon>
                    <ListItemText>Settings</ListItemText>
                  </ListItemButton>
                </ListItem>

              </List>

            </Paper>
          </Box>

        </Drawer>


        <Main drawerOpen={drawerOpen}>
          <Box>
            <Routes>
              <Route path="/" element={<Dashboard/>} />
              <Route path="/employees" element={<Employees/>} />
              <Route path="/reports" element={<Reports/>} />
              <Route path="/settings" element={<Settings/>} />
            </Routes>
          </Box>
        </Main>
      </ThemeProvider>
    </>
  );
}

export default App;
