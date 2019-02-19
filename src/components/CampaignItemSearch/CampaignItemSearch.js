import PropTypes from 'prop-types';
import React from 'react';
import ParticleEffectButton from 'react-particle-effect-button';
import {
  Badge, Card, CardBody, CardText, Collapse,
} from 'reactstrap';
import './CampaignItemSearch.scss';

class CampaignItemSearch extends React.Component {
  state = {
    collapse: false,
    hidden: false,
    animating: false,
    buttonText: 'More Info',
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
        this.setState({ collapse: false, hidden: true });
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
    this.setState({ hidden: !this.state.hidden });
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

  animationComplete = () => {
    const { collapse } = this.state;
    if (collapse) {
      this.setState({
        hidden: false,
        buttonText: 'Close',
      });
    } else {
      this.setState({ hidden: false, buttonText: 'More Info' });
    }
  };

  collapseClosed = () => {
    const { collapseCard } = this.props;
    collapseCard();
  };

  render() {
    const { campaign } = this.props;
    const { collapse, buttonText } = this.state;
    return (
      <div className="CampaignItemSearch mb-3">
        <div className="row">
          <div className="col-sm-8">
            <h4 className="campaign-title">{campaign.title}</h4>
          </div>
          <div className="campaign-btn-div col-sm-4">
            <ParticleEffectButton
              className="particle-btn"
              color="#50a895"
              duration={700}
              hidden={this.state.hidden}
              onComplete={this.animationComplete}
            >
              <button className="button campaign-button" onClick={this.zoomCard}>
                {buttonText}
              </button>
              {/* <button className="button campaign-button" onClick={this.zoomCard}>
                {collapse ? 'Close' : 'More Info'}
              </button> */}
            </ParticleEffectButton>
          </div>
        </div>
        <Collapse className="campaign-collapse" isOpen={collapse} onExited={this.collapseClosed}>
          <Card className="campaign-card" id={campaign.campaignId} />
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
        </Collapse>
      </div>
    );
  }
}

export default CampaignItemSearch;
