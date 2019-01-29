// import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PropTypes from 'prop-types';
import React from 'react';
// import {
//   Circle, Map, Marker, Popup, TileLayer,
// } from 'react-leaflet';
import ReactMapboxGl, { Feature, Layer } from 'react-mapbox-gl';
import apiKeys from '../../helpers/apiKeys';
import './Map.scss';

const Mapbox = ReactMapboxGl({
  accessToken: apiKeys.mapBox.key,
  // interactive: false,
  renderWorldCopies: false,
});

// const myIcon = L.icon({
//   iconUrl: '<i class="fas fa-dice-d20"></i>',
//   iconSize: [25, 42],
//   iconAnchor: [12.5, 42],
//   popupAnchor: [0, -41],
// });

class Maps extends React.Component {
  static propTypes = {
    position: PropTypes.object,
    zoom: PropTypes.array,
    haveUsersLocation: PropTypes.bool,
    searchRadius: PropTypes.number,
  };

  render() {
    // haveUsersLocation, searchRadius,
    const { position, zoom } = this.props;
    return (
      // <div className="Maps">
      <Mapbox
        // eslint-disable-next-line react/style-prop-object
        style="mapbox://styles/mcrank/cjrdujrz51j632smgkqkutz7c"
        // style="mapbox://styles/mcrank/cjrhfdlh90fq82smgxku7fu7s"
        containerStyle={{
          height: '70vh',
          width: 'auto',
        }}
        center={position}
        zoom={zoom}
      >
        <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
          {/* <Feature coordinates={[-0.13235092163085938, 51.518250335096376]} /> */}
          <Feature coordinates={[position.lng, position.lat]} />
        </Layer>
      </Mapbox>
      // </div>
    );
  }
}

export default Maps;
