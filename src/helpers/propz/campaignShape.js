import PropTypes from 'prop-types';

const campaignShape = PropTypes.shape({
  title: PropTypes.string.isRequired,
  imgUrl: PropTypes.string,
  dmName: PropTypes.string.isRequired,
  dmEmail: PropTypes.string.isRequired,
  playersNeeded: PropTypes.number.isRequired,
  notes: PropTypes.string.isRequired,
  street1: PropTypes.string.isRequired,
  street2: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  zipcode: PropTypes.string.isRequired,
  lat: PropTypes.number,
  lng: PropTypes.number,
  uid: PropTypes.string.isRequired,
});

export default campaignShape;
