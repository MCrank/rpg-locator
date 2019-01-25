import PropTypes from 'prop-types';
import React from 'react';
import campaignShape from '../../helpers/propz/campaignShape';
import './CampaignItem.scss';

class CampaignItem extends React.Component {
  static propTypes = {
    campaign: campaignShape,
    index: PropTypes.number,
    deleteCampaign: PropTypes.func,
  };

  removeCampaign = (e) => {
    e.preventDefault();
    const campaignId = e.target.id;
    const { deleteCampaign } = this.props;
    deleteCampaign(campaignId);
  };

  render() {
    const { campaign, index } = this.props;
    const rowNumber = (index + 1).toString();
    return (
      <tr className="CampaignItem">
        <th scope="row">{rowNumber}</th>
        <td>
          <img src={campaign.imgUrl} alt="campaign" />
        </td>
        <td>{campaign.title}</td>
        <td>{campaign.dmName}</td>
        <td>{campaign.playersNeeded}</td>
        <td>{campaign.notes}</td>
        <td>
          <i className="fas fa-scroll fa-lg mr-2" id={campaign.id} />
          <i className="fas fa-book-dead fa-lg ml-2" id={campaign.id} onClick={this.removeCampaign} />
        </td>
      </tr>
    );
  }
}

export default CampaignItem;
