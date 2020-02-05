import React, { useContext, useState, useEffect, useReducer } from 'react';
import styled from 'styled-components';
import { axiosWithAuth } from '../utils/axiosWithAuth';
import { useHistory } from 'react-router-dom';

// contexts
import { PlantsContext } from '../contexts';

// assets
// import Start from '../assets/Start.svg';
import Paint from '../assets/Paint.svg';

function CreatePlant(props) {

    let history = useHistory();
    const { plants, setPlants, species, setSpecies } = useContext(PlantsContext);

    const initialState = {
        isLogged: !!localStorage.getItem('token'),
        isLoading: false,
        user: {
            id: Number(localStorage.getItem('id'))
        },
        plants: JSON.parse(localStorage.getItem('plants')),
        species: JSON.parse(localStorage.getItem('species'))
    }

    function plantReducer(state, action) {
        switch (action.type) {
            case 'START_CREATE':
                return {
                    ...state,
                    isLoading: true
                }
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(plantReducer, initialState);

    // checking if we have our species, plants, and uid
    console.log(state.species);
    console.log(state.plants);
    console.log(state.user.id)

    // new plant state
    const [newPlant, setNewPlant] = useState({
        nickname: '',
        species_id: '',
        location: '',
        user_id: state.user.id
    });

    const handleChange = (e) => {
        setNewPlant({
            ...newPlant,
            [e.target.name]: e.target.value
        });
    }

    const createPlant = (newPlant) => {
        dispatch({ type: 'START_CREATE' });
        axiosWithAuth().post(`/plants`, newPlant)
            .then((res) => {
                // console.log(res);
                history.push(`/plants`);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <Container>
            <div className="start">
                <div className="start-img">
                    <img src={Paint} alt="Start creating a plant" />
                </div>
                <div className="start-info">
                    <h3>Create Your Plant</h3>
                    <p>Creating a plant is easy.</p>
                    <ol>
                        <li>Give it a nickname</li>
                        <li>Tell us where it's located in your home</li>
                        <li>Identify its species</li>
                        {/* <li>Set how many times it needs to be watered per day</li> */}
                    </ol>
                </div>
            </div>
            <form onSubmit={(e) => {
                e.preventDefault();
                // createPlant(newPlant);
                // console.log(newPlant);
            }}>
                <input
                    type="text"
                    name="nickname"
                    placeholder="Nickname"
                    value={newPlant.nickname}
                    onChange={handleChange}
                    autoComplete="off"
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={newPlant.location}
                    onChange={handleChange}
                    autoComplete="off"
                />
                {/* <select name="species_id" onChange={handleChange}>
                    {
                        species.map((x, idx) => {
                            // { console.log(x.id) }
                            return <option key={idx} value={x.id}>{x.common_name}</option>
                        })
                    }
                </select> */}
                {/* <input
                    type="text"
                    name="species"
                    placeholder="Species"
                    value={newPlant.species}
                    onChange={handleChange}
                    autoComplete="off"
                /> */}
                {/* <input
                    type="text"
                    name="h2oFrequency"
                    placeholder="Water how many times a day?"
                    value={newPlant.h2oFrequency}
                    onChange={handleChange}
                    autoComplete="off"
                /> */}
                {/* <input
                    type="url"
                    name="image"
                    placeholder="Enter image URL"
                    value={newPlant.image}
                    onChange={handleChange}
                    autoComplete="off"
                /> */}
                <button type="submit">Create Plant</button>
            </form>
        </Container>
    )
}

const Container = styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;

    form {
        display: flex;
        flex-direction: column;
        align-items: center;

        input {
            margin: 1rem 0;
            width: 25rem;
            height: 3.5rem;
            background: #bfbfbf;
            border: none;
            border-radius: 0.3rem;
            padding: 0.5rem 0.5rem 0.5rem 1rem;
            font-size: 1.2rem;
            font-weight: 300;
            letter-spacing: 0.1rem;
    
            &:focus {
                outline: none;
                border: 1px solid #ababab;
            }
        }

        button {
            width: 20rem;
            height: 3.5rem;
            margin: 2rem 0 1rem;
            background: #d1ffd6;
            border: none;
            border-radius: 0.3rem;
            transition: all 100ms;
            box-shadow: 0px 2px 5px -5px;
            letter-spacing: 0.1rem;
    
            &:hover {
                transition: background 100ms;
                cursor: pointer;
                background: #afdeb4;
            }
        }
    }

    .start {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        margin-bottom: 5%;

        @media (max-width: 1050px) {
            flex-direction: column;
        }

        .start-img {
            width: 40%;

            @media (max-width: 1050px) {
                width: 100%;
            }

            img {
                width: 100%;
            }
        }

        .start-info {
            width: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;

            @media (max-width: 1050px) {
                width: 100%;
                margin-top: 10%;
            }

            h3 {
                font-size: 3rem;
                font-weight: 700;
                letter-spacing: 0.1rem;
                color: #444444;
            }

            p {
                margin: 1rem 0;
                font-size: 2rem;
                font-weight: 300;
                letter-spacing: 0.1rem;
                color: #444444;
                padding-bottom: 1.5rem;
                border-bottom: 1px dotted #444444;
            }

            ol {
                color: #444444;
                font-size: 1.6rem;
                letter-spacing: 0.1rem;
                font-weight: 300;
                margin-top: 1rem;

                li {
                    margin: 2rem 0;
                    border-bottom: 1px dashed #444444;
                    padding-bottom: 1.5rem;
                }
            }

        }
    }
`;

export default CreatePlant;