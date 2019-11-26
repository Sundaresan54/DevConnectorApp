import React, { Fragment, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom'

const Login = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = FormData;
    console.log(FormData, "name getting")
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        console.log(e.target.name, "nameeeee", e.target.value)
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        // if (formData.confrmPassword !== formData.password) {
        //     console.log("password mismatch")
        // } else {

        console.log(formData, "djhdugy")
        // const newUser = {
        //     userName,
        //     email,
        //     password
        // }
        // try {
        //     const config = {
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'mode': 'no-cors'
        //         }
        //     };
        //     const body = newUser;
        //     const res = await axios.post('http://localhost:5002/api/users', body, config);
        //     console.log(res.headers)
        //     console.log(res);
        // } catch (err) {
        //     console.error(err.response.data)
        // }

        // }
    }
    return (
        <Fragment>
            <section className="container">
                <h1 className="large text-primary">Sign In</h1>
                <p className="lead"><i className="fas fa-user"></i> SignIn to the Account</p>
                <form className="form" onSubmit={e => onSubmit(e)} >
                    <div className="form-group">
                        <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)} required />

                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={password}
                                onChange={e => onChange(e)}
                                minLength="6"
                            />
                        </div>
                    </div>
                    <input type="submit" className="btn btn-primary" value="login" />
                </form>
                <p className="my-1">
                    create an account? <Link to="/register">Sign Up</Link>
                </p>
            </section>
        </Fragment>
    )
}

export default Login
