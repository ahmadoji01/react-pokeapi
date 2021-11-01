import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import { signIn, signUp } from '../services/auth';
import { setTokens } from '../utils/token';
import Swal from 'sweetalert2';

export default function AuthModal(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [modalStyle] = React.useState(getModalStyle);
    const [value, setValue] = React.useState(0);

    const [email, setEmail] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    
    const handleModal = (value) => {
        props.handleModal(value)
    }

    const handleSignIn = () => {
        signIn(email, password)
        .then(response => {
            var res = response.data;

            if (res.status === "error") {
                Swal.fire("Oops! Something went wrong", res.message, "error");
                return;
            }

            setTokens(res.data.user.authentication_token, res.data.user.refresh_token);
            handleModal(false);
            window.location.reload();
        });
    }

    const handleSignUp = () => {
        if (password !== confirmPassword) {
            Swal.fire("Please, check your input again", "Password is not the same", "error");
            return;
        }

        signUp(email, firstName, lastName, password)
        .then(response => {
            var res = response.data;

            if (res.status === "error") {
              Swal.fire("Oops! Something went wrong", res.message, "error");
              return;
            }
            
            setTokens(res.data.user.authentication_token, res.data.user.refresh_token);
            handleModal(false);
            window.location.reload();
        })
    }
  
    const body = (
      <div style={modalStyle} className={classes.paper}>
        <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered>
            <Tab label="Sign In" {...a11yProps(0)} />
            <Tab label="Sign Up" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={value} index={0} dir={theme.direction}>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField id="email-input" name="email" label="Email" variant="outlined" onChange={(e) => {setEmail(e.target.value)}} style={{ width: "100%", marginBottom: 20 }} />
                <TextField id="password-input" name="password" type="password" label="Password" variant="outlined" onChange={(e) => {setPassword(e.target.value)}} style={{ width: "100%", marginBottom: 20 }} />
                <Button variant="contained" color="primary" onClick={() => handleSignIn()} style={{ width: "100%" }}>Sign In</Button>
            </form>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField id="first-name-input" name="first-name" label="First Name" variant="outlined" onChange={(e) => {setFirstName(e.target.value)}}  style={{ width: "100%", marginBottom: 20 }} />
                <TextField id="last-name-input" name="last-name" label="Last Name" variant="outlined" onChange={(e) => {setLastName(e.target.value)}}  style={{ width: "100%", marginBottom: 20 }} />
                <TextField id="email-input-2" name="email" label="Email" variant="outlined" onChange={(e) => {setEmail(e.target.value)}}  style={{ width: "100%", marginBottom: 20 }} />
                <TextField id="password-input-2" name="password" type="password" label="Password" variant="outlined" onChange={(e) => {setPassword(e.target.value)}}  style={{ width: "100%", marginBottom: 20 }} />
                <TextField id="confirm-password-input" name="confirm-password" type="password" label="Confirm Password" onChange={(e) => {setConfirmPassword(e.target.value)}}  variant="outlined" style={{ width: "100%", marginBottom: 20 }} />
                <Button variant="contained" color="primary" onClick={() => handleSignUp()} style={{ width: "100%" }}>Sign Up</Button>
            </form>
        </TabPanel>
        <AuthModal />
      </div>
    );
  
    return (
      <div>
        <Modal
          open={props.open}
          onClose={() => handleModal(false)}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {body}
        </Modal>
      </div>
    );
}

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}
  
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
}));