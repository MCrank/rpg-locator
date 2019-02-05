import PropTypes from 'prop-types';
import React from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import authRequests from '../../helpers/data/authRequests';
import autoSuggest from '../../helpers/data/autoSuggest';
import mapboxRequests from '../../helpers/data/mapBoxRequests';
import './CampaignForm.scss';

const defaultCampaign = {
  title: '',
  dmName: '',
  dmEmail: '',
  playersNeeded: '',
  notes: '',
  street1: '',
  street2: '',
  city: '',
  state: '',
  zipcode: '',
  uid: '',
};

const defaultMarker = {
  title: '',
  playersNeeded: '',
  state: '',
  zipcode: '',
  notes: '',
  lat: '',
  lng: '',
  imgUrl: '',
  campaignId: '',
  uid: '',
};

class CampaignForm extends React.Component {
  state = {
    modal: false,
    backdrop: 'static',
    newCampaign: defaultCampaign,
    newMarker: defaultMarker,
    notesMaxLength: 125,
    notesCharCount: 125,
    isLoading: false,
    suggestResults: [],
    suggestedArray: [],
    position: {
      lat: '',
      lng: '',
    },
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

  componentDidMount() {
    autoSuggest.getIpLocation().then((res) => {
      this.setState({
        position: {
          lat: res.data.latitude,
          lng: res.data.longitude,
        },
      });
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
    const tempCampaign = { ...this.state.newCampaign };
    const tempMarker = { ...this.state.newMarker };
    tempCampaign[name] = event.target.value;
    if (['title', 'state', 'zipcode', 'notes', 'imgUrl'].indexOf(name) !== -1) {
      tempMarker[name] = event.target.value;
    }
    this.setState({
      newCampaign: tempCampaign,
      newMarker: tempMarker,
    });
  };

  formFieldNumberState = (name, event) => {
    const tempCampaign = { ...this.state.newCampaign };
    const tempMarker = { ...this.state.newMarker };
    tempCampaign[name] = event.target.value * 1;
    tempMarker[name] = event.target.value * 1;
    this.setState({
      newCampaign: tempCampaign,
      newMarker: tempMarker,
    });
  };

  autoSuggestState = (name, event) => {
    const { suggestedArray, position } = this.state;
    const tempCampaign = { ...this.state.newCampaign };
    const tempMarker = { ...this.state.newMarker };
    const selectedSuggest = suggestedArray.filter(s => s.address.formattedAddress === name[0]);
    const formFill = selectedSuggest[0].address;
    // Lets get the Forward GEO for the selected address to popuate the Marker props
    mapboxRequests
      .getForwardGeocode(formFill.formattedAddress, position.lng, position.lat)
      .then((res) => {
        tempCampaign.street1 = formFill.addressLine;
        tempCampaign.city = formFill.locality;
        tempMarker.city = formFill.locality;
        tempCampaign.state = formFill.adminDistrict;
        tempMarker.state = formFill.adminDistrict;
        tempCampaign.zipcode = formFill.postalCode;
        tempMarker.zipcode = formFill.postalCode;
        tempMarker.lat = res.lat;
        tempMarker.lng = res.lng;
        this.setState({
          newCampaign: tempCampaign,
          newMarker: tempMarker,
        });
        this.typeahead.getInstance().clear();
      })
      .catch(error => console.error('There was an error getting the requested location'));
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
    const myNewMarker = { ...this.state.newMarker };
    myNewCampaign.uid = authRequests.getCurrentUid();
    myNewMarker.uid = authRequests.getCurrentUid();
    onSubmit(myNewCampaign, myNewMarker);
    this.setState({
      newCampaign: defaultCampaign,
      newMarker: defaultMarker,
    });
  };

  autoSuggestEvent = (e) => {
    this.setState({ isLoading: true });
    const query = e;
    autoSuggest
      .getAutoSuggestForm(query)
      .then((results) => {
        this.setState({
          isLoading: false,
          suggestResults: results[0],
          suggestedArray: results[1],
        });
      })
      .catch(error => console.error('There was an issue gettign autosuggest results', error));
  };

  render() {
    const {
      notesCharCount, notesMaxLength, newCampaign, isLoading, suggestResults,
    } = this.state;
    return (
      <div className="CampaignForm">
        <Modal
          className="form-modal"
          isOpen={this.state.modal}
          toggle={e => this.toggle(e)}
          centered
          backdrop={this.state.backdrop}
          size="lg"
        >
          <ModalHeader toggle={e => this.toggle(e)}>Add New Campaign</ModalHeader>
          <ModalBody>
            <Form>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="title">Title</Label>
                    <Input
                      className="form-input"
                      type="text"
                      name="title"
                      id="title"
                      placeholder="ex: Tomb of Annihilation"
                      onChange={this.titleChange}
                      value={newCampaign.title}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="playersNeeded">How many players do you need</Label>
                    <Input
                      className="form-input"
                      type="number"
                      name="number"
                      id="playersNeeded"
                      placeholder="1-10"
                      min="1"
                      max="10"
                      onChange={this.playersChange}
                      value={newCampaign.playersNeeded}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="dmName">DM Name</Label>
                    <Input
                      className="form-input"
                      type="text"
                      name="dmName"
                      id="dmName"
                      placeholder="Masta Blasta"
                      onChange={this.dmNameChange}
                      value={newCampaign.dmName}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="dmEmail">Email Address</Label>
                    <Input
                      className="form-input"
                      type="email"
                      name="email"
                      id="dmEmail"
                      placeholder="OneCoolDM@domain.com"
                      onChange={this.dmEmailCHange}
                      value={newCampaign.dmEmail}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label for="notes">Notes</Label>
                <Input
                  className="form-input"
                  type="textarea"
                  name="text"
                  id="notes"
                  maxLength={notesMaxLength}
                  onChange={this.notesChange}
                  value={newCampaign.notes}
                />
                <Label className="float-right" for="char-count">
                  Remaining: {notesCharCount}/{notesMaxLength}
                </Label>
              </FormGroup>
              <hr className="mt-5" />
              <FormGroup>
                <Label className="typeahead-label" for="street1">
                  Search for Address
                </Label>
                <AsyncTypeahead
                  className="form-input mb-2"
                  ref={(typeahead) => {
                    this.typeahead = typeahead;
                  }}
                  clearButton={true}
                  id="street1"
                  placeholder="Search for address OR type below"
                  options={suggestResults}
                  isLoading={isLoading}
                  onSearch={this.autoSuggestEvent}
                  onChange={this.autoSuggestState}
                  value={newCampaign.street1}
                />
                <Label for="street1">Address</Label>
                <Input
                  className="form-input"
                  type="text"
                  name="address"
                  id="street1"
                  placeholder="1234 Main St"
                  onChange={this.street1Change}
                  value={newCampaign.street1}
                />
              </FormGroup>
              <FormGroup>
                <Label for="street2">Address 2</Label>
                <Input
                  className="form-input"
                  type="text"
                  name="address2"
                  id="street2"
                  placeholder="Apartment, studio, or floor"
                  onChange={this.street2Change}
                  value={newCampaign.street2}
                />
              </FormGroup>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="city">City</Label>
                    <Input
                      className="form-input"
                      type="text"
                      name="city"
                      id="city"
                      onChange={this.cityChange}
                      value={newCampaign.city}
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="state">State</Label>
                    <Input
                      className="form-input"
                      type="text"
                      name="state"
                      id="state"
                      onChange={this.stateChange}
                      value={newCampaign.state}
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <Label for="zipcode">Zip</Label>
                    <Input
                      className="form-input"
                      type="text"
                      name="zip"
                      id="zipcode"
                      onChange={this.zipcodeChange}
                      value={newCampaign.zipcode}
                    />
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
