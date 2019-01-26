import PropTypes from 'prop-types';
import React from 'react';
import {
  Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row,
} from 'reactstrap';
import authRequests from '../../helpers/data/authRequests';

const defaultCampaign = {
  title: '',
  dmName: '',
  dmEmail: '',
  playersNeeded: 0,
  notes: '',
  street1: '',
  street2: '',
  city: '',
  state: '',
  zipcode: '',
  uid: '',
};
class CampaignForm extends React.Component {
  state = {
    modal: false,
    backdrop: 'static',
    newCampaign: defaultCampaign,
    notesMaxLength: 125,
    notesCharCount: 125,
  };

  static propTypes = {
    showModal: PropTypes.bool,
    onSubmit: PropTypes.func,
    isEditing: PropTypes.bool,
    campaignToEdit: PropTypes.object,
  };

  toggle() {
    this.setState({
      modal: !this.state,
    });
  }

  componentWillReceiveProps(props) {
    if (props.isEditing) {
      this.setState({
        newCampaign: props.campaignToEdit,
      });
    }
    this.setState({
      modal: props.showModal,
    });
  }

  formFieldStringState = (name, event) => {
    event.preventDefault();
    const tempListing = { ...this.state.newCampaign };
    tempListing[name] = event.target.value;
    this.setState({ newCampaign: tempListing });
  };

  formFieldNumberState = (name, event) => {
    const tempListing = { ...this.state.newCampaign };
    tempListing[name] = event.target.value * 1;
    this.setState({ newCampaign: tempListing });
  };

  titleChange = event => this.formFieldStringState('title', event);

  playersChange = event => this.formFieldNumberState('playersNeeded', event);

  dmNameChange = event => this.formFieldStringState('dmName', event);

  dmEmailCHange = event => this.formFieldStringState('dmEmail', event);

  notesChange = (event) => {
    this.formFieldStringState('notes', event);
    this.setState({
      notesCharCount: this.state.notesMaxLength - event.target.textLength,
    });
  };

  street1Change = event => this.formFieldStringState('street1', event);

  street2Change = event => this.formFieldStringState('street2', event);

  cityChange = event => this.formFieldStringState('city', event);

  stateChange = event => this.formFieldStringState('state', event);

  zipcodeChange = event => this.formFieldStringState('zipcode', event);

  formSubmit = (event) => {
    event.preventDefault();
    const { onSubmit } = this.props;
    const myNewCampaign = { ...this.state.newCampaign };
    myNewCampaign.uid = authRequests.getCurrentUid();
    onSubmit(myNewCampaign);
    this.setState({ newCampaign: defaultCampaign });
  };

  render() {
    const { notesCharCount, notesMaxLength, newCampaign } = this.state;
    return (
      <div className="CampaignForm">
        <Modal isOpen={this.state.modal} toggle={e => this.toggle(e)} centered backdrop={this.state.backdrop} size="lg">
          <ModalHeader toggle={e => this.toggle(e)}>Add New Campaign</ModalHeader>
          <ModalBody>
            <Form>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="title">Title</Label>
                    <Input type="text" name="title" id="title" placeholder="ex: Tomb of Annihilation" onChange={this.titleChange} value={newCampaign.title} />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="playersNeeded">How many players do you need</Label>
                    <Input type="number" name="number" id="playersNeeded" placeholder="1-10" min="1" max="10" onChange={this.playersChange} value={newCampaign.playersNeeded} />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="dmName">DM Name</Label>
                    <Input type="text" name="dmName" id="dmName" placeholder="John Doe" onChange={this.dmNameChange} value={newCampaign.dmName} />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="dmEmail">Email Address</Label>
                    <Input type="email" name="email" id="dmEmail" placeholder="cooldm@gmail.com" onChange={this.dmEmailCHange} value={newCampaign.dmEmail} />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label for="notes">Notes</Label>
                <Input type="textarea" name="text" id="notes" maxLength={notesMaxLength} onChange={this.notesChange} value={newCampaign.notes} />
                <Label className="float-right" for="char-count">
                  Remaining: {notesCharCount}/{notesMaxLength}
                </Label>
              </FormGroup>
              <FormGroup>
                <Label for="street1">Address</Label>
                <Input type="text" name="address" id="street1" placeholder="1234 Main St" onChange={this.street1Change} value={newCampaign.street1} />
              </FormGroup>
              <FormGroup>
                <Label for="street2">Address 2</Label>
                <Input type="text" name="address2" id="street2" placeholder="Apartment, studio, or floor" onChange={this.street2Change} value={newCampaign.street2} />
              </FormGroup>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="city">City</Label>
                    <Input type="text" name="city" id="city" onChange={this.cityChange} value={newCampaign.city} />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="state">State</Label>
                    <Input type="text" name="state" id="state" onChange={this.stateChange} value={newCampaign.state} />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <Label for="zipcode">Zip</Label>
                    <Input type="text" name="zip" id="zipcode" onChange={this.zipcodeChange} value={newCampaign.zipcode} />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.formSubmit}>
              Submit
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
