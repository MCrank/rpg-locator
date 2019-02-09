import PropTypes from 'prop-types';
import React from 'react';
import ReactMapboxGl, {
  Feature, Layer, Popup, RotationControl, ScaleControl, ZoomControl,
} from 'react-mapbox-gl';
import apiKeys from '../../helpers/apiKeys';
import './Map.scss';

const Mapbox = ReactMapboxGl({
  accessToken: apiKeys.mapBox.key,
  renderWorldCopies: false,
});

class Maps extends React.Component {
  state = {
    campaignPop: {
      title: '',
      campaignId: '',
      position: {
        lng: 0,
        lat: 0,
      },
    },
    prevPostion: {
      lng: 0,
      lat: 0,
    },
  };

  static propTypes = {
    position: PropTypes.object,
    zoom: PropTypes.array,
    pitch: PropTypes.array,
    haveUsersLocation: PropTypes.bool,
    searchRadius: PropTypes.number,
    campaigns: PropTypes.array,
    onZoomEndEvent: PropTypes.func,
    setPosition: PropTypes.func,
  };

  getCurrentZoom = () => {
    const { onZoomEndEvent } = this.props;
    if (this.map) {
      const zoom = this.map.getZoom();
      onZoomEndEvent(zoom);
    }
  };

  markerClick = (e) => {
    const { campaigns, setPosition } = this.props;
    const clickedCampaign = campaigns[e.feature.properties.id];
    this.setState({
      campaignPop: {
        title: clickedCampaign.title,
        campaignId: clickedCampaign.campaignId,
        position: {
          lng: clickedCampaign.lng,
          lat: clickedCampaign.lat,
        },
      },
      prevPostion: {
        lng: this.props.position.lng,
        lat: this.props.position.lat,
      },
    });
    setPosition(this.state.campaignPop.position, 14);
  };

  closePopup = () => {
    const { prevPostion } = this.state;
    const { setPosition } = this.props;
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
    setPosition(prevPostion, 8);
  };

  render() {
    const {
      position, zoom, pitch, campaigns,
    } = this.props;
    const { campaignPop } = this.state;
    return (
      <Mapbox
        onStyleLoad={(el) => {
          this.map = el;
        }}
        // eslint-disable-next-line react/style-prop-object
        style="mapbox://styles/mcrank/cjrdujrz51j632smgkqkutz7c"
        containerStyle={{
          height: '75vh',
          width: 'auto',
        }}
        center={position}
        zoom={zoom}
        pitch={pitch}
        onZoomEnd={this.getCurrentZoom}
      >
        <ZoomControl />
        <RotationControl position="top-right" style={{ top: 80 }} />
        <ScaleControl measurement="mi" position="top-left" />

        <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
          {campaigns.map(campaign => (
            <Feature
              id={campaign.campaignId}
              key={campaign.campaignId}
              coordinates={[campaign.lng, campaign.lat]}
              onClick={this.markerClick}
            />
          ))}
        </Layer>
        {campaignPop && (
          <Popup
            key={campaignPop.campaignId}
            coordinates={[campaignPop.position.lng, campaignPop.position.lat]}
            offset={{
              'bottom-left': [12, -25],
              bottom: [0, -25],
              'bottom-right': [-12, -25],
            }}
            onClick={this.closePopup}
          >
            <h5>{campaignPop.title}</h5>
          </Popup>
        )}
      </Mapbox>
    );
  }
}

export default Maps;
