import PropTypes from 'prop-types';
import React from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';

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

  // Rework this into the formfieldstringstate function when I get to it
  charCount = (e) => {
    console.log(e.target.textLength);
    this.setState({
      notesCharCount: this.state.notesMaxLength - e.target.textLength,
    });
  };

  render() {
    const { notesCharCount, notesMaxLength } = this.state;
    return (
      <div className="CampaignForm">
        <Modal isOpen={this.state.modal} toggle={e => this.toggle(e)} centered backdrop={this.state.backdrop} size="lg">
          <ModalHeader toggle={e => this.toggle(e)}>Add New Campaign</ModalHeader>
          <ModalBody>
            <Form>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="campaign-title">Title</Label>
                    <Input type="text" name="title" id="campaign-title" placeholder="ex: Tomb of Annihilation" />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="players-needed">How many players do you need</Label>
                    <Input type="number" name="number" id="players-needed" placeholder="1-10" min="1" max="10" />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="dm-name">DM Name</Label>
                    <Input type="text" name="dmName" id="dm-name" placeholder="John Doe" />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="dm-email">Email Address</Label>
                    <Input type="email" name="email" id="dm-email" placeholder="cooldm@gmail.com" />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label for="notes">Notes</Label>
                <Input type="textarea" name="text" id="notes" maxLength={notesMaxLength} onKeyUp={this.charCount} />
                <Label className="float-right" for="char-count">
                  Remaining: {notesCharCount}/{notesMaxLength}
                </Label>
              </FormGroup>
              <FormGroup>
                <Label for="street1">Address</Label>
                <Input type="text" name="address" id="street1" placeholder="1234 Main St" />
              </FormGroup>
              <FormGroup>
                <Label for="street2">Address 2</Label>
                <Input type="text" name="address2" id="street2" placeholder="Apartment, studio, or floor" />
              </FormGroup>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="city">City</Label>
                    <Input type="text" name="city" id="city" />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="state">State</Label>
                    <Input type="text" name="state" id="state" />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <Label for="zipcode">Zip</Label>
                    <Input type="text" name="zip" id="zipcode" />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={e => this.toggle(e)}>
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
