import React, {useState, useEffect} from "react";
import { AppBar, Toolbar, Avatar, Typography, Button } from '@mui/material';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import useStyles from './styles';

const theme = createTheme({
    palette: {
      primary: {
        main:'#FFB946',
      },
      secondary: {
        main: '#FFB946',
      },
    },
  });

  
function Homepage() {

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const classes = useStyles();

    useEffect(() => {
        const token = user ?.token;

    setUser(JSON.parse(localStorage.getItem('profile')))
    }, [location]);

    const logout = () => {
        dispatch({ type: "LOGOUT" });
    
        history.push(`${process.env.PUBLIC_URL}/auth`);
    
        setUser(null);
      };

    return (

        <ThemeProvider theme={theme}>
        <div className="Navbar">
        <AppBar className={classes.appBar} position="static" color="inherit">
        <div className={classes.brandContainer}>
          <Typography component={Link} to="/~saku16/editor/" className={classes.heading} variant="h2" align="center">Sandras Editor</Typography>
        </div>
        <Toolbar className={classes.toolbar}>
          {user?.result ? (
            <div className={classes.profile}>
              <Avatar className={classes.purple} alt={user?.result.name} src={user?.result.imageUrl}>{user?.result.name.charAt(0)}</Avatar>
              <Typography className={classes.userName} variant="h6">{user?.result.name}</Typography>
              <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Logout</Button>
            </div>
          ) : (
            <Button component={Link} to={`${process.env.PUBLIC_URL}/auth`} variant="contained" color="primary">Sign In</Button>
          )}
        </Toolbar>
      </AppBar>
      </div>
      </ThemeProvider>
    );

}

export default Homepage;