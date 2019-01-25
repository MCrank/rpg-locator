import PropTypes from 'prop-types';
import React from 'react';
import {
  Button, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';

class CampaignForm extends React.Component {
  state = {
    modal: false,
    backdrop: false,
  };

  static propTypes = {
    showModal: PropTypes.bool,
  };

  componentWillReceiveProps(props) {
    this.setState({
      modal: props.showModal,
    });
  }

  toggle() {
    this.setState({
      modal: !this.state,
    });
  }

  render() {
    return (
      <div className="CampaignForm">
        <Modal isOpen={this.state.modal} toggle={e => this.toggle(e)} centered backdrop={this.state.backdrop}>
          <ModalHeader toggle={e => this.toggle(e)}>Modal title</ModalHeader>
          <ModalBody>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
            non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={e => this.toggle(e)}>
              Do Something
            </Button>{' '}
            <Button color="secondary" onClick={e => this.toggle(e)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default CampaignForm;
