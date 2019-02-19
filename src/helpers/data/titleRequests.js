import axios from 'axios';
import apiKeys from '../apiKeys';

const firebaseDbURL = apiKeys.firebaseConfig.databaseURL;

const getAllTitles = () => new Promise((resolve, reject) => {
  axios
    .get(`${firebaseDbURL}/titles.json`)
    .then((res) => {
      const titlesArr = [];
      if (res.data !== null) {
        Object.keys(res.data).forEach((key) => {
          res.data[key].id = key;
          titlesArr.push(res.data[key]);
        });
      }
      resolve(titlesArr);
    })
    .catch(error => reject(error));
});

export default { getAllTitles };
