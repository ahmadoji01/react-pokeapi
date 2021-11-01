import { LAST_REFRESHED, REFRESH_TOKEN, USER_TOKEN } from "../constants/appconst";

export const setTokens = function(auth_token, refresh_token) {
    localStorage.setItem(USER_TOKEN, auth_token);
    localStorage.setItem(REFRESH_TOKEN, refresh_token);
    localStorage.setItem(LAST_REFRESHED, Date().toLocaleString());
}

export const exceedsMinutes = function(minutes) {
    var diff = Math.abs(new Date() - new Date(localStorage.getItem(LAST_REFRESHED)));
    var diffMinutes = Math.floor((diff/1000)/60);

    if (diffMinutes < minutes) {
        return false;
    }

    return true;
}