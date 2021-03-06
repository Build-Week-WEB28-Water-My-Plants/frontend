import React, { useState, useReducer } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

// contexts
// import { UserContext } from '../contexts';

// assets
import View from '../assets/View.svg';

function Login(props) {

    let history = useHistory();

    // user state
    const [user, setUser] = useState({
        username: '',
        password: '',
        phone_number: ''
    });

    const [err, setErr] = useState('');

    const initialState = {
        isLogged: false,
        isLoading: false,
        error: '',
        user: {
            username: '',
            id: '',
            phone: '',
            plants: []
        }
    }

    function authReducer(state, action) {
        switch (action.type) {
            case 'LOGIN_REQUEST':
                console.log(`hello from login request`);
                return {
                    ...state,
                    isLoading: true,
                };
            case 'LOGIN_SUCCESS':
                console.log(`hello from login success`);
                history.push(`/plants`);
                return {
                    ...state,
                    isLoading: false,
                    isLogged: true,
                    error: '',
                    user: action.payload
                }
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(authReducer, initialState);

    // handle login form input change
    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }


    // login function for form submit
    const log = (user) => {
        dispatch({ type: 'LOGIN_REQUEST' });

        if (user.username === '' || user.password === '') {
            setErr('You must fill out both fields.');
            return;
        }
        else if (user.username.length < 4 || user.username.length >= 32) {
            setErr('Your username must be between 4 and 32 characters.');
            return;
        }
        else if (user.username.match(/[^a-z0-9]/gi, '')) {
            setErr('Please enter a valid username');
            return;
        }
        else if (user.password.length < 4 || user.password.length >= 32) {
            setErr('Your password must be between 4 and 32 characters.');
            return;
        }

        axios.post(`https://water-my-plants-1.herokuapp.com/api/users/login`, user)
            .then((res) => {
                const { token, id } = res.data;
                console.log(res);

                const data = {
                    username: user.username,
                    id: id
                }

                localStorage.setItem('token', token);
                localStorage.setItem('id', id);
                localStorage.setItem('username', user.username);
                dispatch({ type: 'LOGIN_SUCCESS', payload: data })
            })
            .catch((err) => {
                // console.log(err.message);
                setErr('Invalid credentials.');
                setUser({
                    username: '',
                    password: ''
                });
            })
    }

    return (
        <FormContainer>

            <div className="login-message">
                <p>Please login to manage and view your plants.</p>
            </div>

            <form onSubmit={(e) => {
                e.preventDefault();
                log(user);
            }}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={user.username}
                    onChange={handleChange}
                    autoComplete="off"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={handleChange}
                    autoComplete="off"
                />
                <button type="submit">Login</button>

                {/* <div className="extra-options">
                    <span onClick={() => history.push(`/register`)}>Register</span>
                    <span>Forgot Password</span>
                </div> */}
            </form>

            {err && <div className="error">{err}</div>}

            <div className="svg-banner">
                <img src={View} alt="Woman looking at nature" />
            </div>

        </FormContainer>
    )
}

const FormContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .error {
        margin-bottom: 5rem;
        width: 100%;
        text-align: center;
        color: red;
        font-size: 1.4rem;
        font-weight: 300;
        letter-spacing: 0.1rem;
    }
    .svg-banner {
        display: flex;
        justify-content: center;
        img {
            width: 80%;
        }
    }
    .incorrect-login {
        margin-top: 3rem;
        color: #872a26;
        font-size: 1.4rem;
    }
    span {
        margin-top: 0.5rem;
        font-size: 1.2rem;
        &:hover {
            cursor: pointer;
        }
    }
    .login-message {
        h2 {
            font-size: 3rem;
            color: #5f7361;
        }
        p {
            margin-top: 1rem;
            font-size: 1.6rem;
            font-weight: 300;
            letter-spacing: 0.1rem;
            color: #444444;
            @media (max-width: 451px) {
                font-size: 1.4rem;                
            }
            @media (max-width: 403px) {
                font-size: 1.2rem;                
            }
        }
    }
    form {
        padding: 2.5rem 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 60%;
        margin-bottom: 5%;
        @media (max-width: 1440px) {
            width: 70%;
        }
        @media (max-width: 1245px) {
            width: 80%;
        }
        @media (max-width: 1085px) {
            width: 90%;
        }
        
        @media (max-width: 965px) {
            width: 100%;
        }
        @media (max-width: 850px) {
            flex-direction: column;
        }
    }
    input {
        margin: 0.5rem 0;
        width: 20rem;
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
        margin: 1rem 0 0;
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
    .extra-options {
        width: 30%;
        display: flex;
        justify-content: space-evenly;
    }
`;

export default Login;