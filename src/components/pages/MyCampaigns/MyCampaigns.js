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
    isEditing: false,
    editId: '-1',
    campaignToEdit: {},
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

  formSubmitEvent = (newCampaign) => {
    const { isEditing, editId } = this.state;
    if (isEditing) {
      campaignRequests
        .editCampaign(editId, newCampaign)
        .then(() => {
          this.getMyCampaigns();
          this.setState({
            showModal: false,
            isEditing: false,
            editId: '-1',
          });
        })
        .catch(error => console.error('There was an error editing the campaign', error));
    } else {
      campaignRequests
        .newCampaign(newCampaign)
        .then(() => {
          this.getMyCampaigns();
          this.setState({ showModal: false });
        })
        .catch(error => console.error('There was an error creating the new Campaign', error));
    }
  };

  editCampaignItem = (campaignId) => {
    campaignRequests
      .getSingleCampaign(campaignId)
      .then((campaign) => {
        this.setState({
          isEditing: true,
          editId: campaignId,
          campaignToEdit: campaign.data,
        });
        this.showModal();
      })
      .catch(error => console.error('There was an issue getting a single campaign', error));
  };

  showModal = () => {
    this.setState({
      showModal: true,
    });
  };

  render() {
    const { campaigns, isEditing, campaignToEdit } = this.state;
    const campaignItemComponent = campaignsArr => campaignsArr.map((campaign, index) => <CampaignItem key={campaign.id} campaign={campaign} index={index} deleteCampaign={this.deleteCampaign} editForm={this.editCampaignItem} />);

    const editFormProps = {
      campaignToEdit,
    };

    if (!isEditing) {
      editFormProps.disabled = true;
    }

    return (
      <div className="myCampaigns container">
        <h1>MyCampaigns</h1>
        <CampaignForm showModal={this.state.showModal} onSubmit={this.formSubmitEvent} isEditing={isEditing} {...editFormProps} />
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
