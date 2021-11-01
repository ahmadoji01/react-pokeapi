import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { Button, Col, Descriptions, Image, Modal, Row, Tag } from 'antd';
import 'antd/dist/antd.css';
import { catchPokemon, getAPokemon, renameMyPokemon } from '../services/pokemon';
import './pokemondetail.css'
import { capitalize } from '../utils/string';
import { getPlaceholderImg } from '../utils/image';
import { refreshToken } from '../services/auth';
import { exceedsMinutes, setTokens } from '../utils/token';
import TextField from '@material-ui/core/TextField';
import Swal from 'sweetalert2';

export default function PokemonDetail() {
    const [pokemon, setPokemon] = React.useState({});
    const [myPokemonId, setMyPokemonId] = React.useState("");
    const [pokemonName, setPokemonName] = React.useState("");
    const [isModalVisible, setIsModalVisible] = React.useState(false);

    let { id } = useParams();
    var color = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue'];

    const showModal = () => {
        setIsModalVisible(true);
    };
    
    const closeModal = () => {
        setIsModalVisible(false);
    };

    const getPokemon = () => {
        getAPokemon(id)
        .then(response => {
            var res = response.data;
            
            if (res.status.toLowerCase() === "error") {
                Swal.fire("Oops! Something went wrong", res.message, "error");
                return;
            }
            setPokemon(res.data);
        })
    }

    async function catchAPokemon() {
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

        catchPokemon(id)
        .then(response => {
            var res = response.data;
            if (res.status.toLowerCase() === "error") {
                Swal.fire("Oops! Something went wrong", res.message, "error");
                return;
            }

            if (res.status.toLowerCase() === "pokemon_escaped") {
                Swal.fire("Oops!", res.message, "warning");
                return;
            }

            if (res.status.toLowerCase() === "success") {
                setMyPokemonId(res.data.InsertedID);
                showModal();
            }
        })
    }

    async function renamePokemon() {
        if (myPokemonId === "") {
            Swal.fire("Oops! Something went wrong", "You have no pokemon to name", "error");
            closeModal();
            return;
        }

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

        renameMyPokemon(myPokemonId, pokemonName)
        .then(response => {
            var res = response.data;
            if (res.status.toLowerCase() === "error") {
                Swal.fire("Oops! Something went wrong", res.message, "error");
                return;
            }

            if (res.status.toLowerCase() === "success") {
                Swal.fire("Success!", "You have given your pokemon a new name!", "success");
                closeModal();
            }
        })
    }

    useEffect(() => getPokemon(), [])

    if (typeof(pokemon.name) === 'undefined') {
        return "";
    }

    return(
        <Row gutter={16}>
            <Col span={8}>
                <Image
                    width={200}
                    height={200}
                    src={pokemon.img_url}
                    fallback={getPlaceholderImg}
                    />
            </Col> 
            <Col span={16} className="desc-container">
                <Descriptions bordered>
                    <Descriptions.Item label="Pokemon Name" span={2}>{capitalize(pokemon.name)}</Descriptions.Item>
                    <Descriptions.Item label="Types" span={1}>
                        { pokemon.types.map(function(type) {
                            var min = 0;
                            var max = color.length - 1;
                            var i = min + Math.random() * (max - min);
                            return <Tag color={color[i]}>{type.name}</Tag>

                        })}
                    </Descriptions.Item>
                    <Descriptions.Item label="Moves" span={3}>
                        { pokemon.moves.map(function(move) {
                            var min = 0;
                            var max = color.length - 1;
                            var i = min + Math.random() * (max - min);
                            return <Tag color={color[i]}>{move.name}</Tag>

                        })}
                    </Descriptions.Item>
                    <Descriptions.Item label="Actions">
                        <Button type="primary" onClick={catchAPokemon}>Catch Pokemon</Button>
                    </Descriptions.Item>
                </Descriptions>
            </Col>
            <Modal title="You have successfully caught this pokemon!"
                closable={false}
                visible={isModalVisible}
                footer={[<Button key="submit" type="primary" onClick={renamePokemon}>Submit</Button>]} >
                <TextField id="name-input" name="name" label="Give your new pokemon a nickname!" variant="outlined" onChange={(e) => {setPokemonName(e.target.value)}} style={{ width: "100%", marginBottom: 20 }} />
            </Modal>
        </Row>
    )
}