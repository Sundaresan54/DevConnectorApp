import React, { useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getCurrentProfile } from '../../actions/profile'
import Spinner from '../layout/Spinner'

const Dashboard = ({ getCurrentProfile, auth: { user }, profile: { profile, loading } }) => {
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile])
    return (
        <div style={{ marginTop: '5%' }}>

            {profile && loading === null ? <Spinner /> : (<Fragment>
                <h1 className='large text-primary'>Dashboard</h1>
                <p className='lead'>
                    <i className='fas fa-user'></i> Welcome {user && user.userName}
                </p>
                {profile !== null ? <Fragment>yes</Fragment> : <Fragment>
                    <p>
                        You don't have profile, Please setup your profile
                    </p>
                    <Link to='/createProfile' className='btn btn-primary my-1'>
                        create profile</Link>
                </Fragment>}
            </Fragment>

            )
            }
        </div>
    )
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile

})
export default connect(mapStateToProps, { getCurrentProfile })(Dashboard)
