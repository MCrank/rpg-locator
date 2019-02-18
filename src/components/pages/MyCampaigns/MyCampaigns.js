import React from 'react';
import ParticleEffectButton from 'react-particle-effect-button';
import authRequests from '../../../helpers/data/authRequests';
import campaignRequests from '../../../helpers/data/campaignRequests';
import markerRequests from '../../../helpers/data/markerRequests';
import CampaignForm from '../../CampaignForm/CampaignForm';
import CampaignItem from '../../CampaignItem/CampaignItem';
import './MyCampaigns.scss';

class MyCampaigns extends React.Component {
  state = {
    campaigns: [],
    showModal: false,
    isEditing: false,
    campaignEditId: '-1',
    markerEditId: '-1',
    campaignToEdit: {},
    markerToEdit: {},
    hidden: false,
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
        markerRequests.getSingleMarkerId(campaignId).then((markerId) => {
          if (markerId !== null) {
            markerRequests.deleteMarker(markerId);
          }
        });
        this.getMyCampaigns();
        this.setState({ showModal: false });
      })
      .catch(error => console.error('There was an error deleting your campaign', error));
  };

  formSubmitEvent = (newCampaign, newMarker) => {
    const { isEditing, campaignEditId, markerEditId } = this.state;
    if (isEditing) {
      campaignRequests
        .editCampaign(campaignEditId, newCampaign)
        .then(() => {
          markerRequests.editMarker(markerEditId, newMarker).then(() => {
            this.getMyCampaigns();
            this.setState({
              showModal: false,
              isEditing: false,
              campaignEditId: '-1',
              markerEditId: '-1',
            });
          });
        })
        .catch(error => console.error('There was an error editing the campaign', error));
    } else {
      campaignRequests
        .newCampaign(newCampaign)
        .then((res) => {
          newMarker.campaignId = res.data.name;
          markerRequests.newMarker(newMarker);
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
        markerRequests.getSingleMarkerId(campaignId).then((markerId) => {
          this.setState({ markerEditId: markerId });
          markerRequests.getSingleMarker(markerId).then((marker) => {
            this.setState({
              isEditing: true,
              campaignEditId: campaignId,
              campaignToEdit: campaign.data,
              markerToEdit: marker.data,
            });
          });
        });
        this.showModal();
      })
      .catch(error => console.error('There was an issue getting a single campaign', error));
  };

  showModal = (e) => {
    e.preventDefault();
    this.setState({
      hidden: !this.state.hidden,
      showModal: true,
    });
  };

  modalCloseEvent = () => {
    this.setState({
      hidden: !this.state.hidden,
      campaignToEdit: {},
      markerToEdit: {},
      showModal: false,
    });
  };

  render() {
    const {
      campaigns, isEditing, campaignToEdit, markerToEdit,
    } = this.state;
    const campaignItemComponent = campaignsArr => campaignsArr.map((campaign, index) => (
        <CampaignItem
          key={campaign.id}
          campaign={campaign}
          index={index}
          deleteCampaign={this.deleteCampaign}
          editForm={this.editCampaignItem}
        />
    ));

    const editFormProps = {
      campaignToEdit,
      markerToEdit,
    };

    if (!isEditing) {
      editFormProps.disabled = true;
    }

    return (
      <div className="myCampaigns container">
        <h1 className="mt-2">MyCampaigns</h1>
        <CampaignForm
          showModal={this.state.showModal}
          onSubmit={this.formSubmitEvent}
          isEditing={isEditing}
          {...editFormProps}
          modalCloseEvent={this.modalCloseEvent}
        />
        <ParticleEffectButton className="particle-btn" color="#50a895" hidden={this.state.hidden}>
          <button className="new-btn btn btn-info mb-1 float-right" onClick={this.showModal}>
            New
          </button>
        </ParticleEffectButton>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Image</th>
                <th scope="col">Title</th>
                <th scope="col">DM</th>
                <th scope="col">Players</th>
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
