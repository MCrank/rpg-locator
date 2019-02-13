import PropTypes from 'prop-types';
import React from 'react';
import {
  Button, Card, CardBody, CardText, CardTitle, Collapse,
} from 'reactstrap';
import './CampaignItemSearch.scss';

class CampaignItemSearch extends React.Component {
  state = {
    collapse: false,
  };

  // Passing in all campaigns as well so I can filter by array index to show the popup as well.
  static propTypes = {
    campaign: PropTypes.object,
    campaigns: PropTypes.array,
    setPosition: PropTypes.func,
    markerClick: PropTypes.func,
    // collapseCard: PropTypes.func,
    // collapse: PropTypes.bool,
    closePopup: PropTypes.func,
  };

  toggle() {
    const { closePopup } = this.props;
    this.setState({ collapse: !this.state.collapse });
    if (this.state.collapse) {
      closePopup(true);
    }
  }

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
    this.toggle();
    // collapseCard();
  };

  render() {
    const { campaign } = this.props;
    const { collapse } = this.state;
    return (
      <div className="CampaignItemSearch mb-3">
        <h4>{campaign.title}</h4>
        <h6>Players Needed: {campaign.playersNeeded}</h6>
        <Button onClick={this.zoomCard} block={true}>
          {collapse ? 'Close' : 'More Info'}
        </Button>
        <Collapse isOpen={collapse}>
          <Card className="campaign-card" id={campaign.campaignId} />
          {/* <CardHeader>{campaign.title}</CardHeader> */}
          <CardBody>
            <CardTitle>Players Needed: {campaign.playersNeeded}</CardTitle>
            <CardText>DM Notes:</CardText>
            <CardText>{campaign.notes}</CardText>
          </CardBody>
          {/* <div className="card text-white bg-info" id={campaign.campaignId} onClick={this.zoomCard}>
            <h5 className="card-header">{campaign.title}</h5>
            <div className="card-body">
              <h5 className="card-title">{campaign.playersNeeded}</h5>
              <p className="card-text">{campaign.notes}</p>
            </div>
          </div> */}
        </Collapse>
      </div>
    );
  }
}

export default CampaignItemSearch;
