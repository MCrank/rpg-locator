import React from 'react';
import './CampaignItemSearch.scss';

class CampaignItemSearch extends React.Component {
  render() {
    return (
      <div className="CampaignItemSearch">
        <div className="card text-white bg-info">
          <h5 className="card-header">Curse of Strahd</h5>
          <div className="card-body">
            <h5 className="card-title">Special title treatment</h5>
            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
          </div>
        </div>
      </div>
    );
  }
}

export default CampaignItemSearch;
