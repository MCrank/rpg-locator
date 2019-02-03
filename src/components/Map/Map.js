import PropTypes from 'prop-types';
import React from 'react';
import ReactMapboxGl, {
  Feature, Layer, RotationControl, ScaleControl, ZoomControl,
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
    onZoomEndEvent: PropTypes.func,
  };

  getCurrentZoom = () => {
    const { onZoomEndEvent } = this.props;
    if (this.map) {
      const zoom = this.map.getZoom();
      onZoomEndEvent(zoom);
    }
  };

  render() {
    const {
      position, zoom, pitch, campaigns,
    } = this.props;
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
            <Feature key={campaign.campaignId} coordinates={[campaign.lng, campaign.lat]} properties />
          ))}
        </Layer>
      </Mapbox>
    );
  }
}

export default Maps;
