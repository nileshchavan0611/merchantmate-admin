import React from 'react';
import { FormGroup, Label, Col, Row, Button } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import Select from 'react-select';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import IntlMessages from '../../helpers/IntlMessages';
import { Colxx, Separator } from '../../components/common/CustomBootstrap';
import Breadcrumb from '../../containers/navs/Breadcrumb';
import CustomSelectInput from '../../components/common/CustomSelectInput';
import Home from './Map/Home';

import axois from '../../axois';
// import axois from '../../axois';

class UserFormPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isAdd: true,
      merchantID: '',
      markerPosition: {},
      mapPosition: {},
      place: '',
      formData: {
        businessName: '',
        emailAddress: '',
        regionCountry: '',
        site_Id: '',
        businessaddress: '',
        username: '',
        isActive: true,
        user_GoID: '',
        user_ClerkID: '',
        user_TerminalID: '',
        user_FirstName: '',
        user_LastName: '',
        user_Role: '',
        user_UserID: '',
        user_Password: '',
      },
      roles: [
        {
          value: '0',
          key: '0',
          label: 'Supervisor',
        },
        {
          value: '1',
          key: '1',
          label: 'Merchant Admin',
        },
        {
          value: '2',
          key: '2',
          label: 'Clerk',
        },
        {
          value: '3',
          key: '3',
          label: 'Interlinc Agent',
        },
      ],
    };
    this.saveUser = this.saveUser.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    this.setState({ dataLoading: true });
    if (match.params.merchantID) {
      this.getMarchantDetails(match.params.merchantID);
    } else {
      this.setState({ dataLoading: false });
    }
  }

  handleSelectChange = (data) => {
    this.setState({ userRole: data });
  };

  makeAndHandleRequest = (query) => {
    return axois(`Merchants/api/Merchants/SearchMerchantIds/${query}`).then(
      (resp) => {
        /* eslint-disable-line camelcase */
        const options = resp.data.map((i) => ({
          id: i,
          label: i,
        }));
        return { options };
      }
    );
  };

  saveUser = async (values) => {
    const { merchantID, userRole } = this.state;
    const { history } = this.props;
    const { match } = this.props;
    if (!merchantID) {
      this.setState({ errorMsg: 'Please enter Merchant ID' });
      return null;
    }
    const checkTerminalData = await axois.get(
      `/Merchants/api/Merchants/GetClerk/${merchantID}/${values.user_ClerkID}/${values.user_TerminalID}`
    );
    if (checkTerminalData.data) {
      console.log(checkTerminalData.data);
      this.setState({ errorMsg: 'Clerk Id exists for this Terminal ID.' });
      return null;
    }
    if (match.params.terminalID) {
      return axois
        .post(`Merchants/api/Merchants/EditMerchantUser`, {
          id: values.user_id,
          goID: values.user_GoID,
          merchant_ID: merchantID,
          clerkID: values.user_ClerkID,
          terminalID: values.user_TerminalID,
          firstName: values.user_FirstName,
          lastName: values.user_LastName,
          role: userRole.value,
          username: values.user_UserID,
          password: values.user_Password,
          isActive: values.isActive,
        })
        .then((resp) => {
          /* eslint-disable-line camelcase */
          console.log('save data', resp);
          history.push('/app/user-page');
        });
    }
    return axois
      .post(`Merchants/api/Merchants/AddMerchantUser`, {
        goID: values.user_GoID,
        merchant_ID: merchantID,
        clerkID: values.user_ClerkID,
        terminalID: values.user_TerminalID,
        firstName: values.user_FirstName,
        lastName: values.user_LastName,
        role: userRole.value,
        username: values.user_UserID,
        password: values.user_Password,
        isActive: values.isActive,
      })
      .then((resp) => {
        /* eslint-disable-line camelcase */
        console.log('save data', resp);
        history.push('/app/user-page');
      });
  };

  getUserDetails = (terminalID, merchantID) => {
    const { formData, roles } = this.state;
    let userData = {};
    return axois(
      `Merchants/api/Merchants/GetTerminal/${terminalID}/${merchantID}`
    ).then((resp) => {
      /* eslint-disable-line camelcase */
      console.log('rep', resp);
      // eslint-disable-next-line prefer-destructuring
      userData = resp.data;

      formData.user_id = userData.id;
      formData.user_GoID = userData.goID;
      formData.user_ClerkID = userData.clerkID;
      formData.user_TerminalID = userData.terminalID;
      formData.user_FirstName = userData.firstName;
      formData.user_LastName = userData.lastName;
      formData.user_Role = userData.role;
      formData.user_UserID = userData.username;
      formData.user_Password = userData.password;
      formData.isActive = userData.isActive;
      this.setState({
        formData,
        userRole: roles.find((item) => item.value === formData.user_Role),
      });
      this.setState();
      console.log(this.state);
      this.setState({ dataLoading: false });
    });
  };

  getMarchantDetails = (query) => {
    const { match } = this.props;
    const { roles, isAdd } = this.state;
    let formData = {};
    return axois(
      `Merchants/api/Merchants/GetMerchant_By_MerchantID/${query}`
    ).then((resp) => {
      /* eslint-disable-line camelcase */
      console.log('rep', resp);
      // eslint-disable-next-line prefer-destructuring
      formData = resp.data[0];

      formData.user_GoID = formData.id;
      this.handleAddressSelect(formData.businessaddress);
      if (isAdd) {
        formData.user_ClerkID = '';
        formData.user_TerminalID = '';
        formData.user_FirstName = '';
        formData.user_LastName = '';
        formData.user_Role = '';
        formData.user_UserID = '';
        formData.user_Password = '';
        formData.isActive = true;
      }
      this.setState({
        selected: [query],
        merchantID: query,
        errorMsg: '',
      });
      this.setState({
        formData,
        region: formData.regionCountry,
        address: formData.businessaddress,
        selected: [query],
        userRole: roles.find((item) => item.value === resp.data[0].user_Role),
      });

      if (match.params.terminalID) {
        this.getUserDetails(match.params.terminalID, match.params.merchantID);
      } else {
        this.setState({ dataLoading: false });
      }
    });
  };

  handleInputChange = (query) => {
    this.setState({ query });
  };

  menuItemClickHandler = (str) => {
    if (str[0]) {
      this.setState({ merchantID: str[0].id, selected: [str[0].id] });
      this.getMarchantDetails(str[0].id);
    }
  };

  clearStateData = () => {
    this.setState({
      formData: {
        businessName: '',
        emailAddress: '',
        regionCountry: '',
        site_Id: '',
        businessaddress: '',
      },
      region: '',
      address: '',
    });
  };

  handleSearch = (query) => {
    this.setState({ isLoading: true, selected: [], merchantID: '' });
    this.clearStateData();
    this.makeAndHandleRequest(query).then((resp) => {
      this.setState({
        isLoading: false,
        options: resp.options,
      });
    });
  };

  handleAddressChange = (address) => {
    this.setState({ address });
  };

  handleAddressSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => {
        this.setState({ place: results[0] });
        return getLatLng(results[0]);
      })
      .then((latLng) => console.log('Success', latLng))
      .catch((error) => console.error('Error', error));
  };

  render() {
    const { match } = this.props;
    const {
      formData,
      userRole,
      roles,
      dataLoading,
      errorMsg,
      merchantID,
      markerPosition,
      mapPosition,
      place,
      successMsg,
    } = this.state;
    console.log(formData);
    console.log(match);
    return (
      <>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.user-form-page" match={match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs="12" className="mb-4">
            <p>
              <IntlMessages id="menu.user-form-page" />
            </p>
            {errorMsg && <p className="error-msg">{errorMsg}</p>}
            {successMsg && <p className="success-msg">{successMsg}</p>}
            <div className="">
              {!dataLoading && (
                <Formik
                  initialValues={formData}
                  onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                      console.log(values);
                      this.saveUser(values);
                      setSubmitting(false);
                    }, 400);
                  }}
                  enableReinitialize
                >
                  {(props) => (
                    <Form className="" autoComplete="new-password">
                      <Row>
                        <Col>
                          <AsyncTypeahead
                            {...this.state}
                            id="async-pagination-example"
                            labelKey="label"
                            className="mb-3"
                            minLength={1}
                            isInvalid={!!(errorMsg && !merchantID)}
                            onInputChange={this.handleInputChange}
                            onChange={this.menuItemClickHandler}
                            onSearch={this.handleSearch}
                            paginate
                            name="merchant_ID"
                            placeholder="Search for a merchant id..."
                            renderMenuItemChildren={(option) => (
                              <div key={option.id}>
                                <span>{option.label}</span>
                              </div>
                            )}
                            useCache={false}
                          />
                          <Field
                            className="form-control mb-3"
                            name="businessName"
                            value={props.values.businessName}
                            placeholder="business Name"
                            disabled
                          />

                          <PlacesAutocomplete
                            value={props.values.businessaddress}
                            onChange={this.handleAddressChange}
                            onSelect={this.handleAddressSelect}
                          >
                            {({
                              getInputProps,
                              suggestions,
                              getSuggestionItemProps,
                              loading,
                            }) => (
                              <div>
                                <input
                                  {...getInputProps({
                                    placeholder: 'Search Places ...',
                                    className:
                                      'location-search-input form-control mb-3',
                                  })}
                                  disabled
                                />
                                <div className="autocomplete-dropdown-container">
                                  {loading && <div>Loading...</div>}
                                  {suggestions.map((suggestion) => {
                                    const className = suggestion.active
                                      ? 'suggestion-item--active'
                                      : 'suggestion-item';
                                    // inline style for demonstration purpose
                                    const style = suggestion.active
                                      ? {
                                          backgroundColor: '#fafafa',
                                          cursor: 'pointer',
                                        }
                                      : {
                                          backgroundColor: '#ffffff',
                                          cursor: 'pointer',
                                        };
                                    return (
                                      <div
                                        key={suggestion.description}
                                        {...getSuggestionItemProps(suggestion, {
                                          className,
                                          style,
                                        })}
                                      >
                                        <span>{suggestion.description}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </PlacesAutocomplete>

                          <Field
                            className="form-control mb-3"
                            name="regionCountry"
                            value={props.values.regionCountry}
                            placeholder="Region "
                            disabled
                          />

                          <Field
                            className="form-control mb-3"
                            name="emailAddress"
                            value={props.values.emailAddress}
                            placeholder="Email Address"
                            disabled
                          />

                          <Field
                            className="form-control mb-3"
                            name="site_Id"
                            placeholder="Site Id"
                            value={props.values.site_Id}
                            disabled
                          />
                        </Col>
                        <Col>
                          <div>
                            <div className="Map">
                              <Home
                                markerPosition={markerPosition}
                                mapPosition={mapPosition}
                                place={place}
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <Label>Go ID</Label>
                            <Field
                              className="form-control mb-3"
                              name="user_GoID"
                              placeholder="Go ID"
                              value={props.values.user_GoID}
                              disabled
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6" />
                        <Col md="6">
                          <FormGroup>
                            <Label>Terminal ID</Label>
                            <Field
                              className="form-control mb-3"
                              name="user_TerminalID"
                              placeholder="Terminal ID"
                              value={props.values.user_TerminalID}
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <Label>Clerk ID</Label>
                            <Field
                              className="form-control mb-3"
                              name="user_ClerkID"
                              placeholder="Clerk ID"
                              value={props.values.user_ClerkID}
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <Label>First Name</Label>
                            <Field
                              className="form-control mb-3"
                              name="user_FirstName"
                              placeholder="First Name"
                              value={props.values.user_FirstName}
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <Label>Last Name</Label>
                            <Field
                              className="form-control mb-3"
                              name="user_LastName"
                              placeholder="Last Name"
                              value={props.values.user_LastName}
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <Label>Role</Label>
                            <Select
                              components={{ Input: CustomSelectInput }}
                              className="react-select"
                              classNamePrefix="react-select"
                              name="form-field-name"
                              value={userRole}
                              onChange={this.handleSelectChange}
                              options={roles}
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <Label>User ID</Label>
                            <Field
                              className="form-control mb-3"
                              name="user_UserID"
                              placeholder="Username"
                              value={props.values.user_UserID}
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <Label>Passsword</Label>
                            <Field
                              autoComplete="new-password"
                              className="form-control mb-3"
                              name="user_Password"
                              type="password"
                              placeholder="Passsword"
                              value={props.values.user_Password}
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <Label>Repeat Passsword</Label>
                            <Field
                              className="form-control mb-3"
                              name="repeat_password"
                              type="password"
                              placeholder="Repeat Passsword"
                              value={props.values.repeat_password}
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col md="12">
                          <FormGroup>
                            <Label className="d-flex justify-content-start">
                              Active
                              <input
                                className="ml-2 mb-3"
                                name="isActive"
                                placeholder="Username"
                                checked={props.values.isActive}
                                onChange={(e) => {
                                  formData.isActive = e.target.checked;
                                  this.setState({ formData });
                                }}
                                type="checkbox"
                              />
                            </Label>
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <Button
                            color="primary"
                            type="submit"
                            className="d-flex align-items-center"
                          >
                            Save
                            {/* <i className="simple-icon-save ml-2" /> */}
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  )}
                </Formik>
              )}
            </div>
          </Colxx>
        </Row>
      </>
    );
  }
}

export default UserFormPage;
