import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavbar from '../components/AppNavbar/AppNavbar';
import Auth from '../components/pages/Auth/Auth';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <AppNavbar />
        <Auth />
      </div>
    );
  }
}

export default App;
