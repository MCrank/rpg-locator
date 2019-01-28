import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PropTypes from 'prop-types';
import React from 'react';
// import {
//   Circle, Map, Marker, Popup, TileLayer,
// } from 'react-leaflet';
import ReactMapboxGl, { Feature, Layer } from 'react-mapbox-gl';
import './Map.scss';

const Map = ReactMapboxGl({
  accessToken: 'pk.eyJ1IjoibWNyYW5rIiwiYSI6ImNqcjV2aXIxZDA0eTA0M3BnZGg4cWcwOG8ifQ.tTl1AsG0GS4k1aGf7rxNQQ',
});

const myIcon = L.icon({
  iconUrl: '<i class="fas fa-dice-d20"></i>',
  iconSize: [25, 42],
  iconAnchor: [12.5, 42],
  popupAnchor: [0, -41],
  // shadowUrl: 'my-icon-shadow.png',
  // shadowSize: [68, 95],
  // shadowAnchor: [22, 94],
});

class Maps extends React.Component {
  static propTypes = {
    position: PropTypes.object,
    zoom: PropTypes.array,
    haveUsersLocation: PropTypes.bool,
    searchRadius: PropTypes.number,
  };

  render() {
    const {
      position, zoom, haveUsersLocation, searchRadius,
    } = this.props;
    return (
      <div className="Maps">
        <Map
          style="mapbox://styles/mcrank/cjrdujrz51j632smgkqkutz7c"
          containerStyle={{
            height: '70vh',
            width: 'auto',
          }}
          center={position}
          zoom={zoom}
        >
          <Layer type="symbol" id="marker" layout={{ 'icon-image': 'harbor-15' }}>
            <Feature coordinates={position} />
          </Layer>
        </Map>
      </div>
    );
  }
}

export default Maps;
