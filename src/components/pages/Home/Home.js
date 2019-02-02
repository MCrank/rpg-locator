import React from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import autoSuggest from '../../../helpers/data/autoSuggest';
import mapBoxRequests from '../../../helpers/data/mapBoxRequests';
import markerRequests from '../../../helpers/data/markerRequests';
import CampaignItemSearch from '../../CampaignItemSearch/CampaignItemSearch';
import Maps from '../../Map/Map';
import './Home.scss';

class Home extends React.Component {
  state = {
    loading: true,
    isLoading: false,
    autoFocus: true,
    clearButton: true,
    selectHintOnEnter: true,
    suggestResults: [],
    selectedAddress: [],
    position: {
      lat: 0,
      lng: 0,
    },
    region: '',
    haveUsersLocation: false,
    zoom: [2],
    searchRadius: 57,
    searchCampaigns: [],
  };

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          // Reverse Geocode to get the region.  This is being used to filter for campaigns that are near the user
          mapBoxRequests
            .getReverseGeoRegion(lng, lat)
            .then((region) => {
              this.setState({ region });
            })
            .catch(error => console.error('There was an error get reverse Geo information', error));
          this.setState({
            position: {
              lat,
              lng,
            },
            haveUsersLocation: true,
            zoom: [9],
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
                region: results.data.region,
                haveUsersLocation: true,
                zoom: [9],
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

  componentDidUpdate(prevProps, prevState) {
    const {
      region, haveUsersLocation, position, searchRadius,
    } = this.state;
    if (region && haveUsersLocation) {
      if (prevState.region !== region) {
        this.getNearbyCampaigns(region, position, searchRadius);
      }
    }
  }

  getNearbyCampaigns = (region, currentPosition, maxDistance) => {
    markerRequests
      .getMarkers(region, currentPosition, maxDistance)
      .then((res) => {
        this.setState({
          searchCampaigns: res,
        });
      })
      .catch(error => console.error('There was an error retrieving regional campaigns', error));
  };

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

  searchResultsEvent = (e) => {
    if (e.key === 'Enter') {
      const { position, searchRadius } = this.state;
      const searchString = e.target.value;
      mapBoxRequests
        .getForwardGeocode(searchString, position.lng, position.lat)
        .then((res) => {
          this.setState({
            position: {
              lat: res.lat,
              lng: res.lng,
            },
            region: res.region,
          });
          this.getNearbyCampaigns(this.state.region, this.state.position, searchRadius);
        })
        .catch(error => console.error('there was an error getting the requested location', error));
    }
  };

  render() {
    const {
      suggestResults,
      isLoading,
      autoFocus,
      clearButton,
      selectHintOnEnter,
      position,
      zoom,
      haveUsersLocation,
      searchRadius,
      searchCampaigns,
    } = this.state;

    const campaignItemSearchComponent = campaignsArr => campaignsArr.map(campaign => <CampaignItemSearch key={campaign.id} campaign={campaign} />);

    return (
      <div className="Home">
        <h1 className="mt-2">Search for Campaigns</h1>
        <AsyncTypeahead
          autoFocus={autoFocus}
          clearButton={clearButton}
          className="suggest-input container"
          labelKey="formattedAddress"
          options={suggestResults}
          isLoading={isLoading}
          selectHintOnEnter={selectHintOnEnter}
          placeholder="Enter your address"
          bsSize="lg"
          onSearch={this.autoSuggestEvent}
          onKeyDown={this.searchResultsEvent}
        />
        <div className="container-fluid mt-5">
          <div className="row">
            <div className="campaign-col col-sm-4">{campaignItemSearchComponent(searchCampaigns)}</div>
            <div className="map-col col-sm-8">
              <Maps
                position={position}
                zoom={zoom}
                haveUsersLocation={haveUsersLocation}
                searchRadius={searchRadius}
                campaigns={searchCampaigns}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
