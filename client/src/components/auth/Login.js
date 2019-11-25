import React, { Fragment, useState } from 'react'
import axios from 'axios';

const Login = () => {

    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        confrmPassword: ''
    });

    const { userName, email, password, confrmPassword } = FormData;
    console.log(FormData, "name getting")
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        console.log(e.target.name, "nameeeee", e.target.value)
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        if (formData.confrmPassword !== formData.password) {
            console.log("password mismatch")
        } else {

            // console.log(formData, "djhdugy", formData.confrmPassword)
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

        }
    }
    return (
        <Fragment>
            <section className="container">
                <h1 className="large text-primary">Sign Up</h1>
                <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
                <form className="form" onSubmit={e => onSubmit(e)} >
                    <div className="form-group">
                        <input type="text" placeholder="UserName" name="userName" value={userName} onChange={e => onChange(e)} required />
                    </div>
                    <div className="form-group">
                        <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)} required />
                        <small className="form-text"
                        >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
                        >
                    </div>
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
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name="confrmPassword"
                            value={confrmPassword}
                            onChange={e => onChange(e)}
                            minLength="6"
                        />
                    </div>
                    <input type="submit" className="btn btn-primary" value="Register" />
                </form>
                <p className="my-1">
                    Already have an account? <a href="login.html">Sign In</a>
                </p>
            </section>
        </Fragment>
    )
}

export default Login