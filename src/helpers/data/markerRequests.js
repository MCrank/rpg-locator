import axios from 'axios';
import apiKeys from '../apiKeys';
import utils from '../utils/utils';

const firebaseDbURL = apiKeys.firebaseConfig.databaseURL;

const getMarkers = (state, currentPos, maxDistance) => new Promise((resolve, reject) => {
  axios
    .get(`${firebaseDbURL}/markers.json?orderBy="state"&equalTo="${state}"`)
    .then((res) => {
      console.log('Markers Axios', res.data);
      const markersArr = [];
      if (res.data !== null) {
        Object.keys(res.data).forEach((key) => {
          res.data[key].id = key;
          const distance = utils.latlngDistance(
            currentPos.lat,
            currentPos.lng,
            res.data[key].lat,
            res.data[key].lng,
            'K',
          );
          if (distance <= maxDistance) {
            markersArr.push(res.data[key]);
          }
        });
      }
      resolve(markersArr);
    })
    .catch(error => reject(error));
});

const deleteMarker = campaignId => axios.delete(`${firebaseDbURL}/markers/${campaignId}.json`);

const newMarker = campaign => axios.post(`${firebaseDbURL}/markers.json`, campaign);

const getSingleMarker = campaignId => axios.get(`${firebaseDbURL}/markers/${campaignId}.json`);

const editMarker = (campaignId, campaign) => axios.put(`${firebaseDbURL}/markers/${campaignId}.json`, campaign);

export default {
  getMarkers,
  deleteMarker,
  newMarker,
  getSingleMarker,
  editMarker,
};
