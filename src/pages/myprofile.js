import React, { useEffect } from 'react';
import { Button, Card, Descriptions, Image, Tag } from 'antd';
import './myprofile.css';
import { exceedsMinutes, setTokens } from '../utils/token';
import { getMyProfile, refreshToken } from '../services/auth';
import { capitalize } from '@material-ui/core';
import { getPlaceholderImg } from '../utils/image';
import { releasePokemon, renameMyPokemon } from '../services/pokemon';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const imgGridStyle = {
  width: '25%',
  textAlign: 'center',
};

const infoGridStyle = {
  width: '75%',
  height: 254
}

export default function MyProfile() {
    const [myPokemons, setMyPokemons] = React.useState([]);
    const [fullName, setFullName] = React.useState("");

    async function getProfile() {
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

        getMyProfile()
        .then(response => {
            var res = response.data;

            if (res.status.toLowerCase() === "error") {
                Swal.fire("Oops! Something went wrong", res.message, "error");
                return;
            }

            setFullName(res.data.user.first_name);
            setMyPokemons(res.data.my_pokemons)
        })
    }

    const confirmRelease = function(myPokemonId) {
        MySwal.fire({
            title: '<p>Are you sure?</p>',
            icon: 'warning',
            html: 'You are trying to release this pokemon',
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: 'Yes, please!',
            cancelButtonText: 'Oops, No!',
        })
        .then((result) => {
            if (result.isConfirmed) {
                releaseMyPokemon(myPokemonId);
            }
        });
    }

    async function renamePokemon(myPokemonId) {
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

        renameMyPokemon(myPokemonId, "")
        .then(response => {
            var res = response.data;
            if (res.status.toLowerCase() === "error") {
                Swal.fire("Oops! Something went wrong", res.message, "error");
                return;
            }

            if (res.status.toLowerCase() === "success") {
                Swal.fire("Success!", "You have given your pokemon a new name!", "success");
                getProfile();
                return;
            }
        })
    }

    async function releaseMyPokemon(myPokemonId) {
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

        releasePokemon(myPokemonId)
        .then(response => {
            var res = response.data;
            if (res.status.toLowerCase() === "error") {
                Swal.fire("Oops! Something went wrong", res.message, "error");
                return;
            }

            if (res.status.toLowerCase() === "pokemon_wont_release") {
                Swal.fire("Too bad!", "Your pokemon is not willing to be released", "warning");
                return;
            }

            if (res.status.toLowerCase() === "success") {
                Swal.fire("Sad", "Your pokemon has been released", "success");
                getProfile();
                return;
            }
        })
    }

    useEffect(() => getProfile(), [])

    return(
        <div class="my-profile-cont">
            <h2>Welcome, {fullName}. Check out your pokemon here</h2>
            { myPokemons.map(function(pokemon, index){
                var pokeData = pokemon.pokemon_data;
                var pokeId = pokemon._id;
                var cardId = 'my-pokemon-' + index;
                var nameId = 'my-pokemon-name' + index;
                return (
                    <Card id={cardId} className="my-pokemon-card" title={capitalize(pokeData.name)} actions={[
                        <Button type="primary" onClick={() => renamePokemon(pokeId)}>Rename</Button>,
                        <Button type="primary" onClick={() => confirmRelease(pokeId)} danger>Release</Button>,
                      ]}>
                        <Card.Grid style={imgGridStyle}>
                            <Image
                                width={200}
                                height={200}
                                src={pokeData.img_url}
                                fallback={getPlaceholderImg()} />
                        </Card.Grid>
                        <Card.Grid style={infoGridStyle}>
                            <Descriptions bordered>
                                <Descriptions.Item label="Nickname" span={3}>
                                    <span id={nameId}>{pokemon.name}</span>
                                </Descriptions.Item>
                                <Descriptions.Item label="Types" span={3}>
                                    { pokeData.types.map(function(type) {
                                        return <Tag>{type.name}</Tag>
                                    })}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card.Grid>
                    </Card>
                )
            }) }
        </div>
    )
}