import axios from "axios";
import { API_URL, REFRESH_TOKEN, USER_TOKEN } from "../constants/appconst";

export const signIn = function(email, password) {
    return axios.post( API_URL + '/sign_in', {
        email,
        password
    })
}

export const signUp = function(email, firstName, lastName, password) {
    return axios.post( API_URL + '/sign_up', {
        first_name: firstName,
        last_name: lastName,
        email,
        password
    })
}

export const refreshToken = function() {
    return axios.post( API_URL + '/refresh_token', {}, {
        headers: {
            'Authorization': localStorage.getItem(REFRESH_TOKEN)
        }
    });
}

export const getMyProfile = function() {
    return axios.get( API_URL + '/my_profile', {
        headers: {
            'Authorization': localStorage.getItem(USER_TOKEN)
        }
    })
}

export const isLoggedIn = function() {
    if (localStorage.getItem(USER_TOKEN))
        return true;

    return false;
}

export const logOut = function() {
    return axios.post( API_URL + '/sign_out', {}, {
        headers: {
            'Authorization': localStorage.getItem(USER_TOKEN),
            'Content-Type': 'application/json'
        }
    }) 
}