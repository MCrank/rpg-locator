import React from 'react';
import {
  BrowserRouter, Route, Redirect, Switch,
} from 'react-router-dom';

import AppNavbar from '../components/AppNavbar/AppNavbar';
import Auth from '../components/pages/Auth/Auth';
import './App.css';

const PublicRoute = ({ component: Component, authed, ...rest }) => {
  // props contains Location, Match, and History
  const routeChecker = props => (authed === false ? <Component {...props} /> : <Redirect to={{ pathname: '/home', state: { from: props.location } }} />);
  return <Route {...rest} render={props => routeChecker(props)} />;
};
class App extends React.Component {
  state = {
    authed: false,
    pendingUser: true,
  };

  render() {
    const { authed } = this.state;
    return (
      <div className="App">
        <BrowserRouter>
          <React.Fragment>
            <AppNavbar isAuthed={authed} />
            <div className="container">
              <div className="row justify-content-center">
                <Switch>
                  <PublicRoute path="/auth" component={Auth} />
                </Switch>
              </div>
            </div>
          </React.Fragment>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
