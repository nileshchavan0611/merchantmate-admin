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

import axois from '../../axois';
// import axois from '../../axois';

class UserFormPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isAdd: true,
      merchantID: '',
      formData: {
        businessName: '',
        emailAddress: '',
        regionCountry: '',
        site_Id: '',
        businessaddress: '',
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
    this.saveMerchant = this.saveMerchant.bind(this);
  }

  componentDidMount() {}

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

  saveMerchant = (values) => {
    const { merchantID, userRole } = this.state;
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
      })
      .then((resp) => {
        /* eslint-disable-line camelcase */
        console.log('save data', resp);
      });
  };

  getMarchantDetails = (query) => {
    const { roles, isAdd } = this.state;
    let formData = {};
    return axois(
      `Merchants/api/Merchants/GetMerchant_By_MerchantID/${query}`
    ).then((resp) => {
      /* eslint-disable-line camelcase */
      console.log('rep', resp);
      // eslint-disable-next-line prefer-destructuring
      formData = resp.data[0];

      if (isAdd) {
        formData.user_GoID = '';
        formData.user_ClerkID = '';
        formData.user_TerminalID = '';
        formData.user_FirstName = '';
        formData.user_LastName = '';
        formData.user_Role = '';
        formData.user_UserID = '';
        formData.user_Password = '';
      }
      this.setState({
        formData,
        userRole: roles.find((item) => item.value === resp.data[0].user_Role),
      });
    });
  };

  handleInputChange = (query) => {
    this.setState({ query });
  };

  menuItemClickHandler = (str) => {
    if (str[0]) {
      this.setState({ merchantID: str[0].id });
      this.getMarchantDetails(str[0].id);
    }
  };

  handleSearch = (query) => {
    this.setState({ isLoading: true });
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
      .then((results) => getLatLng(results[0]))
      .then((latLng) => console.log('Success', latLng))
      .catch((error) => console.error('Error', error));
  };

  render() {
    const { match } = this.props;
    const { formData, userRole, roles } = this.state;
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
            <div className="">
              <Formik
                initialValues={formData}
                onSubmit={(values, { setSubmitting }) => {
                  setTimeout(() => {
                    console.log(values);
                    this.saveMerchant(values);
                    setSubmitting(false);
                  }, 400);
                }}
                enableReinitialize
              >
                {(props) => (
                  <Form className="">
                    <Row>
                      <Col>
                        <AsyncTypeahead
                          {...this.state}
                          id="async-pagination-example"
                          labelKey="label"
                          className="mb-3"
                          minLength={1}
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
                        <div>Map</div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <Label>Terminal ID</Label>
                          <Field
                            className="form-control mb-3"
                            name="user_TerminalID"
                            placeholder="Terminal ID"
                            value={props.values.user_TerminalID}
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
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Go ID</Label>
                          <Field
                            className="form-control mb-3"
                            name="user_GoID"
                            placeholder="Go ID"
                            value={props.values.user_GoID}
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
                          <Label>Passsword</Label>
                          <Field
                            className="form-control mb-3"
                            name="user_Password"
                            placeholder="Passsword"
                            value={props.values.user_Password}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Repeat Passsword</Label>
                          <Field
                            className="form-control mb-3"
                            name="repeat_password"
                            placeholder="Repeat Passsword"
                            value={props.values.repeat_password}
                          />
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
            </div>
          </Colxx>
        </Row>
      </>
    );
  }
}

export default UserFormPage;
