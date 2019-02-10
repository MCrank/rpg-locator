import React from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { InputGroup } from 'reactstrap';
import autoSuggest from '../../../helpers/data/autoSuggest';
import mapBoxRequests from '../../../helpers/data/mapBoxRequests';
import markerRequests from '../../../helpers/data/markerRequests';
import CampaignItemSearch from '../../CampaignItemSearch/CampaignItemSearch';
import Map from '../../Map/Map';
import './Home.scss';

class Home extends React.Component {
  state = {
    isLoading: false,
    autoFocus: true,
    clearButton: true,
    selectHintOnEnter: true,
    suggestResults: [],
    selectedSearchAddress: '',
    position: {
      lat: 0,
      lng: 0,
    },
    region: '',
    haveUsersLocation: false,
    zoom: [2],
    pitch: [0],
    searchRadius: 57,
    searchCampaigns: [],
    campaignPop: {
      title: '',
      campaignId: '',
      position: {
        lng: 0,
        lat: 0,
      },
    },
    prevPosition: {
      lng: 0,
      lat: 0,
    },
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
            zoom: [8],
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
                zoom: [8],
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
            zoom: [8],
            pitch: [0],
          });
          this.getNearbyCampaigns(this.state.region, this.state.position, searchRadius);
          this.typeahead.getInstance().clear();
          this.closePopup();
        })
        .catch(error => console.error('There was an error getting the requested location', error));
    } else {
      this.setState({ selectedSearchAddress: e.target.value });
    }
  };

  onZoomEndEvent = (zoomLvl) => {
    this.setState({ zoom: [zoomLvl] });
  };

  markerClick = (markerId) => {
    const { searchCampaigns } = this.state;
    const clickedCampaign = searchCampaigns[markerId];
    this.setState({
      campaignPop: {
        title: clickedCampaign.title,
        campaignId: clickedCampaign.campaignId,
        position: {
          lng: clickedCampaign.lng,
          lat: clickedCampaign.lat,
        },
      },
      prevPosition: {
        lng: this.state.position.lng,
        lat: this.state.position.lat,
      },
    });
    this.setPosition(this.state.campaignPop.position, 14);
  };

  callSetPos = () => {
    const { campaignPop } = this.state;
    this.setPosition(campaignPop.position, 14);
  };

  closePopup = (oldposition) => {
    const { prevPosition } = this.state;
    this.setState({
      campaignPop: {
        title: '',
        campaignId: '',
        position: {
          lng: 0,
          lat: 0,
        },
      },
    });
    if (oldposition) {
      this.setPosition(prevPosition, 8);
    }
  };

  setPosition = (position, zoomLvl) => {
    this.setState({
      position: {
        lat: position.lat,
        lng: position.lng,
      },
      zoom: [zoomLvl],
    });
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
      pitch,
      haveUsersLocation,
      searchRadius,
      searchCampaigns,
      campaignPop,
    } = this.state;

    const campaignItemSearchComponent = campaignsArr => campaignsArr.map(campaign => (
        <CampaignItemSearch
          key={campaign.id}
          campaign={campaign}
          campaigns={searchCampaigns}
          setPosition={this.setPosition}
          markerClick={this.markerClick}
        />
    ));

    return (
      <div className="Home">
        <h1 className="mt-2">Search for Campaigns</h1>
        <InputGroup className="search-form container w-50">
          <AsyncTypeahead
            ref={(typeahead) => {
              this.typeahead = typeahead;
            }}
            autoFocus={autoFocus}
            clearButton={clearButton}
            className="suggest-input"
            labelKey="formattedAddress"
            options={suggestResults}
            isLoading={isLoading}
            selectHintOnEnter={selectHintOnEnter}
            placeholder="Type your address, 'Enter' to Search"
            bsSize="lg"
            onSearch={this.autoSuggestEvent}
            onKeyDown={this.searchResultsEvent}
          />
          {/* Was thinking to use ths button. Going to leave it for now just in case */}
          {/* <InputGroupAddon addonType="append">
            <Button color="secondary">Search</Button>
          </InputGroupAddon> */}
        </InputGroup>
        <div className="container-fluid mt-5">
          <div className="row">
            <div className="campaign-col col-sm-4">{campaignItemSearchComponent(searchCampaigns)}</div>
            <div className="map-col col-sm-8">
              <Map
                position={position}
                zoom={zoom}
                pitch={pitch}
                haveUsersLocation={haveUsersLocation}
                searchRadius={searchRadius}
                campaigns={searchCampaigns}
                campaignPop={campaignPop}
                onZoomEndEvent={this.onZoomEndEvent}
                markerClick={this.markerClick}
                closePopup={this.closePopup}
                setPosition={this.setPosition}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
