import React from 'react';
import authRequests from '../../../helpers/data/authRequests';
import campaignRequests from '../../../helpers/data/campaignRequests';
import CampaignItem from '../../CampaignItem/CampaignItem';

class MyCampaigns extends React.Component {
  state = {
    campaigns: [],
  };

  componentDidMount() {
    campaignRequests
      .getMyCampaigns(authRequests.getCurrentUid())
      .then((results) => {
        this.setState({
          campaigns: results,
        });
      })
      .catch(error => console.error('An error occured retrieving campaigns', error));
  }

  render() {
    const { campaigns } = this.state;
    const campaignItemComponent = campaignsArr => campaignsArr.map(campaign => <CampaignItem key={campaign.id} campaign={campaign} />);

    return (
      <div className="myCampaigns">
        <h1>MyCampaigns</h1>
        {campaignItemComponent(campaigns)}
      </div>
    );
  }
}

export default MyCampaigns;
