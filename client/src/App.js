import React, {
  Fragment, useEffect
} from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import './App.css';
import { Provider } from 'react-redux'
import store from './store';
import Alert from './components/layout/Alert'
import { loadUser } from '../src/actions/auth'
import setAuthToken from '../src/utils/setAuthToken'


import NavBar from '../src/components/layout/Navbar'
import Landing from '../src/components/layout/Landing'
import Register from '../src/components/auth/Register';
import Login from '../src/components/auth/Login'
import Dashboard from '../src/components/dashboard/Dashboard'
import PrivateRoute from '../src/components/routing/Private'
import CreateProfile from '../src/components/profileForm/CreateProfile'


if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment >
          <NavBar />
          <Route exact path='/' component={Landing} />
          <Alert />
          <Switch >
            <Route path='/register' component={Register} />
            <Route path='/login' component={Login} />
            <PrivateRoute path='/dashboard' component={Dashboard} />
            <PrivateRoute path='/createProfile' component={CreateProfile} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>

  )

}



export default App;