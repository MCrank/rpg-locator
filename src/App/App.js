import firebase from 'firebase/app';
import 'firebase/auth';
import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar/AppNavbar';
import Auth from '../components/pages/Auth/Auth';
import Home from '../components/pages/Home/Home';
import MyCampaigns from '../components/pages/MyCampaigns/MyCampaigns';
import authRequests from '../helpers/data/authRequests';
import connection from '../helpers/data/connection';
import './App.scss';

const PublicRoute = ({ component: Component, authed, ...rest }) => {
  // props contains Location, Match, and History
  const routeChecker = props => (authed === false ? <Component {...props} /> : <Redirect to={{ pathname: '/home', state: { from: props.location } }} />);
  return <Route {...rest} render={props => routeChecker(props)} />;
};

const PrivateRoute = ({ component: Component, authed, ...rest }) => {
  // props contains Location, Match, and History
  const routeChecker = props => (authed === true ? <Component {...props} /> : <Redirect to={{ pathname: '/auth', state: { from: props.location } }} />);
  return <Route {...rest} render={props => routeChecker(props)} />;
};

class App extends React.Component {
  state = {
    authed: false,
    pendingUser: true,
  };

  componentDidMount() {
    connection();

    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authed: true,
          pendingUser: false,
        });
      } else {
        this.setState({
          authed: false,
          pendingUser: false,
        });
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render() {
    const { authed, pendingUser } = this.state;
    const logoutClickEvent = () => {
      authRequests.logoutUser();
      this.setState({
        authed: false,
      });
    };

    if (pendingUser) {
      return null;
    }

    return (
      <div className="App">
        <BrowserRouter>
          <React.Fragment>
            <AppNavbar isAuthed={authed} logoutClickEvent={logoutClickEvent} />
            <div className="app-content container-fluid">
              <div className="justify-content-center">
                <Switch>
                  <PublicRoute path="/auth" component={Auth} authed={authed} />
                  <PrivateRoute path="/" exact component={Home} authed={authed} />
                  <PrivateRoute path="/home" component={Home} authed={authed} />
                  <PrivateRoute path="/campaigns" component={MyCampaigns} authed={authed} />
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
