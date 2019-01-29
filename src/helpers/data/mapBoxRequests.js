import axios from 'axios';
import apiKeys from '../apiKeys';

const { key } = apiKeys.mapBox;
const mapBoxBaseUrl = 'https://api.mapbox.com';

const getReverseGeoRegion = (lng, lat) => new Promise((resolve, reject) => {
  axios
    .get(`${mapBoxBaseUrl}/geocoding/v5/mapbox.places/${lng},${lat}.json?types=region&access_token=${key}`)
    .then((res) => {
      resolve(res.data.features[0].text);
    })
    .catch(error => reject(error));
});

export default { getReverseGeoRegion };
