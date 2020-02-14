import axios from 'axios'

import {
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    AUTH_ERROR,
    USER_LOADED,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    CLEAR_PROFILE,
    LOGOUT

} from '../actions/types'
import { setAlert } from '../actions/alert'
import setAuthToken from '../utils/setAuthToken'


//load user
export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.get('/api/auth/');

        dispatch({
            type: USER_LOADED,
            payload: res.data
        })

    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}



//register user
export const register = ({ userName, email, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ userName, email, password });
    try {
        console.log(body)
        const res = await axios.post('/api/users', body, config);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })
        dispatch(loadUser())
    } catch (err) {
        console.log(err.message);
        const errors = err.response.data.json;
        console.log("hsxhsxsxhbhb gsyxb", err.response.data.json)
        if (errors) {
            console.log("hsxhsxsxhbhb gsyxb")
            errors.forEach(error => { dispatch(setAlert(error.msg, 'danger')) });
        }
        dispatch({
            type: REGISTER_FAILURE
        })
    }
}


//login

export const login = ({ formData }) => async dispatch => {
    const { email, password } = formData;
    console.log("login inside", email, password)
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ email, password });
    try {
        console.log(body)
        const res = await axios.post('/api/auth', body, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })

        dispatch(loadUser())
    } catch (err) {

        const errors = err.response.data.error;
        if (errors) {
            console.log("hsxhsxsxhbhb gsyxb")
            errors.forEach(error => { dispatch(setAlert(error.msg, 'danger')) });
        }
        dispatch({
            type: LOGIN_FAILURE
        })
    }
}
export const logout = () => dispatch => {
    dispatch({
        type: CLEAR_PROFILE
    });
    dispatch({
        type: LOGOUT
    });
}