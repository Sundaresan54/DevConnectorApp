import React, {
  Fragment
} from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import './App.css';

import NavBar from '../src/components/layout/Navbar'
import Landing from '../src/components/layout/Landing'
import Register from '../src/components/auth/Register';
import Login from '../src/components/auth/Login'

const App = () =>

  <div className="App" >
    <Router>
      <Fragment>
        <NavBar />
        <Route exact path='/' component={Landing} />
        <Switch>
          <Route path='/register' component={Register} />
          <Route path='/login' component={Login} />
        </Switch>
      </Fragment>
    </Router>
  </div>

export default App;