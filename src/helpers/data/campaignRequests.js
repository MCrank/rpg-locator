import axios from 'axios';
import apiKeys from '../apiKeys';

const firebaseDbURL = apiKeys.firebaseConfig.databaseURL;

const getMyCampaigns = uid => new Promise((resolve, reject) => {
  axios
    .get(`${firebaseDbURL}/campaigns.json?orderBy="uid"&equalTo="${uid}"`)
    .then((res) => {
      const campaignsArr = [];
      if (res.data !== null) {
        Object.keys(res.data).forEach((key) => {
          res.data[key].id = key;
          campaignsArr.push(res.data[key]);
        });
      }
      resolve(campaignsArr);
    })
    .catch(error => reject(error));
});

export default { getMyCampaigns };
