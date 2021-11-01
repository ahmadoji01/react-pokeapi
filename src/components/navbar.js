import React from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import "./navbar.css";
import { Button } from '@material-ui/core';
import AuthModal from './auth-modal';
import { isLoggedIn, logOut, refreshToken } from '../services/auth';
import { Link } from 'react-router-dom';
import { exceedsMinutes, setTokens } from '../utils/token';
import { REFRESH_TOKEN, USER_TOKEN } from '../constants/appconst';
import Swal from 'sweetalert2';

export default function NavBar() {
  const classes = useStyles();
  const [openModal, setOpenModal] = React.useState(null);

  const menuId = 'primary-search-account-menu';

  let loggedIn = isLoggedIn();
  let myProfileButton;
  if (!loggedIn) {
    myProfileButton = <IconButton edge="end" aria-controls={menuId} aria-haspopup="true" onClick={() => setOpenModal(true)} style={{ color: '#ffffff' }}><AccountCircle /></IconButton>
  } else {
    myProfileButton = <Link to="/my_profile"><IconButton edge="end" aria-controls={menuId} aria-haspopup="true" style={{ color: '#ffffff' }}><AccountCircle /></IconButton></Link>
  }

  const handleOpenModal = function(newValue) {
    setOpenModal(newValue);
  }

  async function logUserOut() {
    if (exceedsMinutes(14)) {
      const response = await refreshToken();

      var res = response.data;
      if (res.status.toLowerCase() === "error") {
          Swal.fire("Oops! Something went wrong", res.message, "error");
          return;
      }

      var data = response.data.data.token;
      setTokens(data.auth_token, data.refresh_token);
    }

    logOut()
    .then(response => {
      var res = response.data;

      if (res.status.toLowerCase() === "error") {
        Swal.fire("Oops! Something went wrong", res.message, "error");
        return;
      }

      if (res.status.toLowerCase() === "success") {
        localStorage.removeItem(USER_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.reload();
      }
    })
  }

  return (
    <div className={classes.grow}>
        <AuthModal open={openModal} handleModal={handleOpenModal} />
        <AppBar position="static">
          <Toolbar>
            <Typography className={classes.title} variant="h6" noWrap style={{ color: '#ffffff' }}>
              Poke API Web Application
            </Typography>
            <Link style={{ textDecoration: 'none', color: 'white' }} to="/"><Button color="inherit">Home</Button></Link>
            { !loggedIn 
              ? <Button edge="end" aria-controls={menuId} aria-haspopup="true" onClick={() => setOpenModal(true)} color="inherit">My Pokemon</Button> 
              : <Link style={{ textDecoration: 'none', color: 'white' }} to="/my_profile"><Button color="inherit">My Pokemon</Button></Link> 
            }
            <div className={classes.sectionDesktop + " navbar-right-menu"}>
              {myProfileButton}
              { loggedIn 
              ? <IconButton edge="end" aria-controls={menuId} aria-haspopup="true" onClick={logUserOut} style={{ color: '#ffffff' }}><ExitToAppRoundedIcon /></IconButton> : ""}
            </div>
          </Toolbar>
        </AppBar>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));