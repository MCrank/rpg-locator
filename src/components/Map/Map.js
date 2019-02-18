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
  static propTypes = {
    position: PropTypes.object,
    zoom: PropTypes.array,
    pitch: PropTypes.array,
    haveUsersLocation: PropTypes.bool,
    searchRadius: PropTypes.number,
    campaigns: PropTypes.array,
    activePop: PropTypes.bool,
    campaignPop: PropTypes.object,
    onZoomEndEvent: PropTypes.func,
    markerClick: PropTypes.func,
    closePopup: PropTypes.func,
    // setPosition: PropTypes.func,
  };

  getCurrentZoom = () => {
    const { onZoomEndEvent } = this.props;
    if (this.map) {
      const zoom = this.map.getZoom();
      onZoomEndEvent(zoom);
    }
  };

  markerItemClick = (e) => {
    const { markerClick } = this.props;
    const clickedMarkerId = e.feature.properties.id;
    markerClick(clickedMarkerId);
  };

  closeMyPopup = () => {
    const { closePopup } = this.props;
    closePopup(true);
  };

  render() {
    const {
      position, zoom, pitch, campaigns, campaignPop, activePop,
    } = this.props;

    return (
      <Mapbox
        className="campaign-map"
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
              onClick={this.markerItemClick}
            />
          ))}
        </Layer>
        {activePop ? (
          <Popup
            className="campaign-pop"
            key={campaignPop.campaignId}
            coordinates={[campaignPop.position.lng, campaignPop.position.lat]}
            offset={{
              'bottom-left': [12, -25],
              bottom: [0, -25],
              'bottom-right': [-12, -25],
            }}
            onClick={this.closeMyPopup}
          >
            <h4>{campaignPop.title}</h4>
            <hr />
            <p>Players Needed: {campaignPop.playersNeeded}</p>
          </Popup>
        ) : null}
        ;
      </Mapbox>
    );
  }
}

export default Maps;
