import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';


const Private = ({ component: Component, auth: { isAuthenticated, isLoading }, ...rest }) => (
    <Route {...rest} render={props => !isAuthenticated && !isLoading ? (<Redirect to='/login' />) : (<Component {...props} />)} />
)

Private.propTypes = {

}
const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(Private)
