import React from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import autoSuggest from '../../../helpers/data/autoSuggest';
import './Home.scss';

class Home extends React.Component {
  state = {
    isLoading: false,
    autoFocus: true,
    clearButton: true,
    selectHintOnEnter: true,
    suggestResults: [],
    selectedAddress: [],
    position: {
      lat: 51.505,
      lng: -0.09,
    },
    haveUsersLocation: false,
    zoom: 2,
    searchRadius: 24140,
  };

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.setState({
            position: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            },
            haveUsersLocation: true,
            zoom: 13,
          });
        },
        () => {
          autoSuggest
            .getIpLocation()
            .then((results) => {
              this.setState({
                position: {
                  lat: results.data.latitude,
                  lng: results.data.longitude,
                },
              });
            })
            .catch(error => console.error('There was an error getting IP location', error));
        },
        {
          enableHighAccuracy: true,
          timeout: 3000,
        },
      );
    } else {
      console.error('Geolocation is not supported by this browser');
    }
  }

  autoSuggestEvent = (e) => {
    this.setState({ isLoading: true });
    const query = e;
    const { position } = this.state;
    autoSuggest
      .getAutoSuggest(query, position.lat, position.lng)
      .then((results) => {
        this.setState({
          isLoading: false,
          suggestResults: results,
        });
      })
      .catch(error => console.error('There was an issue gettign autosuggest results', error));
  };

  render() {
    const {
      suggestResults, isLoading, autoFocus, clearButton, selectHintOnEnter,
    } = this.state;
    return (
      <div className="Home">
        <h1 className="mt-2">Search for Campaigns</h1>
        <AsyncTypeahead
          autoFocus={autoFocus}
          clearButton={clearButton}
          className="suggest-input"
          labelKey="formattedAddress"
          options={suggestResults}
          isLoading={isLoading}
          selectHintOnEnter={selectHintOnEnter}
          placeholder="Enter your address"
          bsSize="lg"
          onSearch={this.autoSuggestEvent}
        />
      </div>
    );
  }
}

export default Home;
