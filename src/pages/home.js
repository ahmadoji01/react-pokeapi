import React, { useEffect } from 'react';
import { Carousel } from 'antd';
import { getAllPokemons } from '../services/pokemon';
import { Card } from 'antd';
import 'antd/dist/antd.css';
import './home.css'
import { capitalize } from '../utils/string';
import Swal from 'sweetalert2';

export default function Home() {
    const [pokemons, setPokemons] = React.useState([]);

    const getPokemons = () => {
        getAllPokemons()
        .then(response => {
            var res = response.data;

            if (res.status.toLowerCase() === "error") {
                Swal.fire("Oops! Something went wrong", res.message, "error");
                return;
            }
            setPokemons(res.data);
        });
    }

    useEffect(() => getPokemons(), [])
    
    return(
        <div>
            <Carousel effect="fade">
                <div>
                    <h3 style={contentStyle}>1</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>1</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>1</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>1</h3>
                </div>
            </Carousel>
            <h1>Browse All Pokemons</h1>
            <div class="cards">
                { pokemons.map(function(pokemon) {
                return (
                    <span class="card">
                        <a href={`/pokemon/${pokemon._id}`}>
                            <Card
                            hoverable
                            style={{ width: 240 }}
                            cover={<img alt="example" src={pokemon.img_url} />}>
                                <Meta title={capitalize(pokemon.name)} description="" />
                            </Card>
                        </a>
                    </span>
                )   
                })}
            </div>
        </div>
    )
}

const { Meta } = Card;

const contentStyle = {
    height: '500px',
    color: '#fff',
    lineHeight: '500px',
    textAlign: 'center',
    background: '#364d79',
};