import axios from 'axios';
import apiKeys from '../apiKeys';
import utils from '../utils/utils';

const firebaseDbURL = apiKeys.firebaseConfig.databaseURL;

const getMarkers = (state, currentPos, maxDistance) => new Promise((resolve, reject) => {
  axios
    .get(`${firebaseDbURL}/markers.json?orderBy="state"&equalTo="${state}"`)
    .then((res) => {
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

const getSingleMarkerId = campaignId => new Promise((resolve, reject) => {
  axios
    .get(`${firebaseDbURL}/markers.json?orderBy="campaignId"&equalTo="${campaignId}"`)
    .then((res) => {
      if (Object.keys(res.data).length !== 0) {
        const markerId = Object.keys(res.data)[0];
        resolve(markerId);
      } else {
        resolve(null);
      }
    })
    .catch(error => reject(error));
});

const deleteMarker = markerId => axios.delete(`${firebaseDbURL}/markers/${markerId}.json`);

const newMarker = marker => axios.post(`${firebaseDbURL}/markers.json`, marker);

const getSingleMarker = markerId => axios.get(`${firebaseDbURL}/markers/${markerId}.json`);

const editMarker = (markerId, marker) => axios.put(`${firebaseDbURL}/markers/${markerId}.json`, marker);

export default {
  getMarkers,
  getSingleMarkerId,
  deleteMarker,
  newMarker,
  getSingleMarker,
  editMarker,
};
