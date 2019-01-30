import PropTypes from 'prop-types';
import React from 'react';
import './CampaignItemSearch.scss';

class CampaignItemSearch extends React.Component {
  state = {};

  static propTypes = {
    campaign: PropTypes.object,
  };

  render() {
    const { campaign } = this.props;
    return (
      <div className="CampaignItemSearch">
        <div className="card text-white bg-info">
          <h5 className="card-header">{campaign.title}</h5>
          <div className="card-body">
            <h5 className="card-title">{campaign.playersNeeded}</h5>
            <p className="card-text">{campaign.notes}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default CampaignItemSearch;
