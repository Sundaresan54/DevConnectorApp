import React, {
  Fragment
} from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import './App.css';
import { Provider } from 'react-redux'
import store from './store';
import Alert from './components/layout/Alert'


import NavBar from '../src/components/layout/Navbar'
import Landing from '../src/components/layout/Landing'
import Register from '../src/components/auth/Register';
import Login from '../src/components/auth/Login'

const App = () =>

  <div className="App" >
    <Provider store={store}>
      <Router>
        <Fragment>
          <NavBar />
          <Route exact path='/' component={Landing} />
          <Alert />
          <Switch>
            <Route path='/register' component={Register} />
            <Route path='/login' component={Login} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  </div>

export default App;