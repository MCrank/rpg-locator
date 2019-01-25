import React from 'react';
import authRequests from '../../../helpers/data/authRequests';
import campaignRequests from '../../../helpers/data/campaignRequests';
import CampaignForm from '../../CampaignForm/CampaignForm';
import CampaignItem from '../../CampaignItem/CampaignItem';
import './MyCampaigns.scss';

class MyCampaigns extends React.Component {
  state = {
    campaigns: [],
    showModal: false,
  };

  componentDidMount() {
    this.getMyCampaigns();
  }

  getMyCampaigns = () => {
    campaignRequests
      .getMyCampaigns(authRequests.getCurrentUid())
      .then((results) => {
        this.setState({
          campaigns: results,
        });
      })
      .catch(error => console.error('An error occured retrieving campaigns', error));
  };

  deleteCampaign = (campaignId) => {
    campaignRequests
      .deleteCampaign(campaignId)
      .then(() => {
        this.getMyCampaigns();
        this.setState({ showModal: false });
      })
      .catch(error => console.error('There was an error deleting your campaign', error));
  };

  addNewCampaign = (newCampaign) => {
    campaignRequests
      .newCampaign(newCampaign)
      .then(() => {
        this.getMyCampaigns();
        this.setState({ showModal: false });
      })
      .catch(error => console.error('There was an error creating the new Campaign', error));
  };

  showModal = () => {
    this.setState({
      showModal: true,
    });
  };

  render() {
    const { campaigns } = this.state;
    const campaignItemComponent = campaignsArr => campaignsArr.map((campaign, index) => <CampaignItem key={campaign.id} campaign={campaign} index={index} deleteCampaign={this.deleteCampaign} />);

    return (
      <div className="myCampaigns container">
        <h1>MyCampaigns</h1>
        <CampaignForm showModal={this.state.showModal} onSubmit={this.addNewCampaign} />
        <button className="btn btn-info mb-1 float-right" onClick={this.showModal}>
          New
        </button>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Image</th>
                <th scope="col">Title</th>
                <th scope="col">DM</th>
                <th scope="col">Players Needed</th>
                <th scope="col-sm">Notes</th>
                <th scope="col">Edit/Delete</th>
              </tr>
            </thead>
            <tbody>{campaignItemComponent(campaigns)}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default MyCampaigns;
