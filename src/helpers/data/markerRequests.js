import axios from 'axios';
import apiKeys from '../apiKeys';

const firebaseDbURL = apiKeys.firebaseConfig.databaseURL;

const getMarkers = state => new Promise((resolve, reject) => {
  axios
    .get(`${firebaseDbURL}/markers.json?orderBy="state"&equalTo="${state}"`)
    .then((res) => {
      console.log('Markers Axios', res.data);
      const markersArr = [];
      if (res.data !== null) {
        Object.keys(res.data).forEach((key) => {
          res.data[key].id = key;
          markersArr.push(res.data[key]);
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
