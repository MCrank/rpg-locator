import PropTypes from 'prop-types';
import React from 'react';
import './CampaignItemSearch.scss';

class CampaignItemSearch extends React.Component {
  state = {};

  // Passing in all campaigns as well so I can filter by array index to show the popup as well.
  static propTypes = {
    campaign: PropTypes.object,
    campaigns: PropTypes.array,
    setPosition: PropTypes.func,
    markerClick: PropTypes.func,
  };

  zoomCard = (e) => {
    const {
      campaign, campaigns, markerClick, setPosition,
    } = this.props;
    const clickedCampaignId = campaigns.map(c => c.campaignId).indexOf(campaign.campaignId);
    markerClick(clickedCampaignId);
    setPosition(
      {
        lng: campaign.lng,
        lat: campaign.lat,
      },
      14,
    );
  };

  render() {
    const { campaign } = this.props;
    return (
      <div className="CampaignItemSearch mb-3">
        <div className="card text-white bg-info" id={campaign.campaignId} onClick={this.zoomCard}>
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
