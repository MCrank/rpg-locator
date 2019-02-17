import PropTypes from 'prop-types';
import React from 'react';
import {
  Badge, Card, CardBody, CardText, Collapse,
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
    collapseCard: PropTypes.func,
    closeCollapse: PropTypes.bool,
    closePopup: PropTypes.func,
    whichCollapse: PropTypes.string,
  };

  componentDidUpdate() {
    const { closeCollapse } = this.props;
    if (closeCollapse) {
      if (this.state.collapse) {
        this.setState({ collapse: false });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.whichCollapse !== this.props.whichCollapse) {
      if (nextProps.whichCollapse === this.props.campaign.campaignId) {
        this.toggle();
      }
    }
  }

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
  };

  collapseClosed = () => {
    const { collapseCard } = this.props;
    collapseCard();
  };

  render() {
    const { campaign } = this.props;
    const { collapse } = this.state;
    return (
      <div className="CampaignItemSearch mb-3">
        <div className="row">
          <div className="col-sm-8">
            <h4 className="campaign-title">{campaign.title}</h4>
          </div>
          <div className="col-sm-4">
            <button className="button campaign-button" onClick={this.zoomCard}>
              {collapse ? 'Close' : 'More Info'}
            </button>
            {/* <Button className="button campaign-button" onClick={this.zoomCard} block={true}>
              {collapse ? 'Close' : 'More Info'}
            </Button> */}
          </div>
        </div>
        <Collapse className="campaign-collapse" isOpen={collapse} onExited={this.collapseClosed}>
          <Card className="campaign-card" id={campaign.campaignId} />
          {/* <CardHeader>{campaign.title}</CardHeader> */}
          <CardBody>
            <div className="row">
              <div className="campaign-card-vl col-sm-8">
                <CardText className="campaign-players">Players Needed:</CardText>
                <CardText className="campaign-players-value">
                  <Badge>{campaign.playersNeeded}</Badge>
                </CardText>
                <hr />
                <CardText className="campaign-notes-title">DM Notes:</CardText>
                <CardText className="campaign-notes">{campaign.notes}</CardText>
              </div>
              <div className="col-sm-4 text-align-center-center">
                <img className="campaign-card-img" src={campaign.imgUrl} alt="" />
              </div>
            </div>
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
