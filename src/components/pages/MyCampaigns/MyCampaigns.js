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
    const campaignItemComponent = campaignsArr => campaignsArr.map((campaign, index) => <CampaignItem key={campaign.id} campaign={campaign} index={index} />);

    return (
      <div className="myCampaigns container-fluid">
        <h1>MyCampaigns</h1>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Image</th>
              <th scope="col">Title</th>
              <th scope="col">DM</th>
              <th scope="col">Players Needed</th>
              <th scope="col-2">Notes</th>
              <th scope="col">Edit/Delete</th>
            </tr>
          </thead>
          <tbody>{campaignItemComponent(campaigns)}</tbody>
        </table>
      </div>
    );
  }
}

export default MyCampaigns;
