import axios from "axios"
import { API_URL, USER_TOKEN } from "../constants/appconst";

export const getAllPokemons = function() {
    return axios.get( API_URL + "/pokemons" );
}

export const getAPokemon = function(id) {
    return axios.get( API_URL + "/pokemon/" + id );
}

export const catchPokemon = function(id) {
    return axios.post( API_URL + "/catch_pokemon", { pokemon_id: id }, {
        headers: {
            'Authorization': localStorage.getItem(USER_TOKEN),
            'Content-Type': 'application/json'
        }
    })
}

export const renameMyPokemon = function(id, name) {
    return axios.patch( API_URL + "/rename_my_pokemon", { _id: id, name: name }, {
        headers: {
            'Authorization': localStorage.getItem(USER_TOKEN),
            'Content-Type': 'application/json'
        }
    })
}

export const releasePokemon = function(id) {
    return axios.delete( API_URL + "/release_pokemon", {
        headers: {
            'Authorization': localStorage.getItem(USER_TOKEN),
            'Content-Type': 'application/json'
        },
        data: { _id: id }
    })
}