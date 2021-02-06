/* eslint-disable no-unused-vars */
import React from 'react';
import { Row, Button, Col } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps';
import IntlMessages from '../../helpers/IntlMessages';
import { Colxx, Separator } from '../../components/common/CustomBootstrap';
import Breadcrumb from '../../containers/navs/Breadcrumb';
import axois from '../../axois';
// import axois from '../../axois';

class MerchantFormPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latLng: {},
      isLoading: false,
      merchantID: '',
      address: '',
      selected: [],
      formData: {
        businessName: '',
        emailAddress: '',
        regionCountry: '',
        site_Id: '',
        businessaddress: '',
      },
      errorMsg: '',
    };
    this.saveMerchant = this.saveMerchant.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    if (match.params.merchantID) {
      this.getMarchantDetails(match.params.merchantID);
    }
  }

  makeAndHandleRequest = (query) => {
    return axois(`Merchants/api/Merchants/SearchCustMerchantIds/${query}`).then(
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
    const { merchantID, address, region, formData } = this.state;
    const { history } = this.props;
    if (!merchantID) {
      this.setState({ errorMsg: 'Please enter merchant id' });
      return null;
    }

    if (formData.id) {
      return axois
        .post(`Merchants/api/Merchants/Edit`, {
          id: formData.id,
          merchant_ID: merchantID,
          businessName: values.businessName,
          businessaddress: address,
          emailAddress: values.emailAddress,
          regionCountry: region,
          site_Id: values.site_Id,
          logo: formData.logo,
        })
        .then((resp) => {
          /* eslint-disable-line camelcase */
          console.log('save data', resp);
          history.push('/app/merchant-page');
        });
    }
    return axois
      .post(`Merchants/api/Merchants/Create`, {
        merchant_ID: merchantID,
        businessName: values.businessName,
        businessaddress: address,
        emailAddress: values.emailAddress,
        regionCountry: region,
        site_Id: values.site_Id,
        logo: '',
      })
      .then((resp) => {
        /* eslint-disable-line camelcase */
        console.log('save data', resp);
        history.push('/app/merchant-page');
      });
  };

  getMarchantDetails = (query) => {
    return axois(
      `Merchants/api/Merchants/GetMerchant_By_MerchantID/${query}`
    ).then((resp) => {
      /* eslint-disable-line camelcase */
      console.log('rep', resp);
      const merchantData = resp.data[0];
      this.setState({
        selected: [query],
        merchantID: query,
        errorMsg: '',
      });
      if (merchantData) {
        this.setState({
          formData: merchantData,
          region: merchantData.regionCountry,
          address: merchantData.businessaddress,
          selected: [query],
        });
      }
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

  handleRegionChange = (event) => {
    console.log('event', event);
    this.setState({ region: event.target.value });
  };

  handleAddressSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => {
        console.log(results[0]);
        this.handleAddressChange(results[0].formatted_address);
        return getLatLng(results[0]);
      })
      .then((latLng) => {
        console.log('Success', latLng);
        this.setState({ latLng });
      })
      .catch((error) => console.error('Error', error));
  };

  render() {
    const { match } = this.props;
    const {
      formData,
      address,
      region,
      query,
      latLng,
      errorMsg,
      merchantID,
    } = this.state;
    console.log(formData);
    console.log(match, query);
    return (
      <>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.merchant-form-page" match={match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs="12" className="mb-4">
            <p>
              <IntlMessages id="menu.merchant-form-page" />
            </p>
            {errorMsg && <p className="error-msg">{errorMsg}</p>}
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
                {(props) => {
                  console.log('nilesh', props.values);
                  return (
                    <Form className="">
                      <Row>
                        <Col>
                          <AsyncTypeahead
                            {...this.state}
                            id="async-pagination-example"
                            labelKey="label"
                            className="mb-3"
                            minLength={1}
                            isInvalid={errorMsg && !merchantID}
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
                            required
                          />

                          <PlacesAutocomplete
                            value={address}
                            onChange={this.handleAddressChange}
                            onSelect={this.handleAddressSelect}
                            required
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
                                    required: true,
                                  })}
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

                          <select
                            className="form-control mb-3"
                            value={region}
                            onBlur={this.handleRegionChange}
                            onChange={this.handleRegionChange}
                            required
                          >
                            <option value="">Select Region</option>
                            <option value="Afghanistan">Afghanistan</option>
                            <option value="Albania">Albania</option>
                            <option value="Algeria">Algeria</option>
                            <option value="Andorra">Andorra</option>
                            <option value="Angola">Angola</option>
                            <option value="Antigua &amp; Deps">
                              Antigua &amp; Deps
                            </option>
                            <option value="Argentina">Argentina</option>
                            <option value="Armenia">Armenia</option>
                            <option value="Australia">Australia</option>
                            <option value="Austria">Austria</option>
                            <option value="Azerbaijan">Azerbaijan</option>
                            <option value="Bahamas">Bahamas</option>
                            <option value="Bahrain">Bahrain</option>
                            <option value="Bangladesh">Bangladesh</option>
                            <option value="Barbados">Barbados</option>
                            <option value="Belarus">Belarus</option>
                            <option value="Belgium">Belgium</option>
                            <option value="Belize">Belize</option>
                            <option value="Benin">Benin</option>
                            <option value="Bhutan">Bhutan</option>
                            <option value="Bolivia">Bolivia</option>
                            <option value="Bosnia Herzegovina">
                              Bosnia Herzegovina
                            </option>
                            <option value="Botswana">Botswana</option>
                            <option value="Brazil">Brazil</option>
                            <option value="Brunei">Brunei</option>
                            <option value="Bulgaria">Bulgaria</option>
                            <option value="Burkina">Burkina</option>
                            <option value="Burundi">Burundi</option>
                            <option value="Cambodia">Cambodia</option>
                            <option value="Cameroon">Cameroon</option>
                            <option value="Canada">Canada</option>
                            <option value="Cape Verde">Cape Verde</option>
                            <option value="Central African Rep">
                              Central African Rep
                            </option>
                            <option value="Chad">Chad</option>
                            <option value="Chile">Chile</option>
                            <option value="China">China</option>
                            <option value="Colombia">Colombia</option>
                            <option value="Comoros">Comoros</option>
                            <option value="Congo">Congo</option>
                            <option value="Congo {Democratic Rep}">
                              Congo &#123; Democratic Rep &rbrace;
                            </option>
                            <option value="Costa Rica">Costa Rica</option>
                            <option value="Croatia">Croatia</option>
                            <option value="Cuba">Cuba</option>
                            <option value="Cyprus">Cyprus</option>
                            <option value="Czech Republic">
                              Czech Republic
                            </option>
                            <option value="Denmark">Denmark</option>
                            <option value="Djibouti">Djibouti</option>
                            <option value="Dominica">Dominica</option>
                            <option value="Dominican Republic">
                              Dominican Republic
                            </option>
                            <option value="East Timor">East Timor</option>
                            <option value="Ecuador">Ecuador</option>
                            <option value="Egypt">Egypt</option>
                            <option value="El Salvador">El Salvador</option>
                            <option value="Equatorial Guinea">
                              Equatorial Guinea
                            </option>
                            <option value="Eritrea">Eritrea</option>
                            <option value="Estonia">Estonia</option>
                            <option value="Ethiopia">Ethiopia</option>
                            <option value="Fiji">Fiji</option>
                            <option value="Finland">Finland</option>
                            <option value="France">France</option>
                            <option value="Gabon">Gabon</option>
                            <option value="Gambia">Gambia</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Germany">Germany</option>
                            <option value="Ghana">Ghana</option>
                            <option value="Greece">Greece</option>
                            <option value="Grenada">Grenada</option>
                            <option value="Guatemala">Guatemala</option>
                            <option value="Guinea">Guinea</option>
                            <option value="Guinea-Bissau">Guinea-Bissau</option>
                            <option value="Guyana">Guyana</option>
                            <option value="Haiti">Haiti</option>
                            <option value="Honduras">Honduras</option>
                            <option value="Hungary">Hungary</option>
                            <option value="Iceland">Iceland</option>
                            <option value="India">India</option>
                            <option value="Indonesia">Indonesia</option>
                            <option value="Iran">Iran</option>
                            <option value="Iraq">Iraq</option>
                            <option value="Ireland {Republic}">
                              Ireland &#123; Republic &rbrace;
                            </option>
                            <option value="Israel">Israel</option>
                            <option value="Italy">Italy</option>
                            <option value="Ivory Coast">Ivory Coast</option>
                            <option value="Jamaica">Jamaica</option>
                            <option value="Japan">Japan</option>
                            <option value="Jordan">Jordan</option>
                            <option value="Kazakhstan">Kazakhstan</option>
                            <option value="Kenya">Kenya</option>
                            <option value="Kiribati">Kiribati</option>
                            <option value="Korea North">Korea North</option>
                            <option value="Korea South">Korea South</option>
                            <option value="Kosovo">Kosovo</option>
                            <option value="Kuwait">Kuwait</option>
                            <option value="Kyrgyzstan">Kyrgyzstan</option>
                            <option value="Laos">Laos</option>
                            <option value="Latvia">Latvia</option>
                            <option value="Lebanon">Lebanon</option>
                            <option value="Lesotho">Lesotho</option>
                            <option value="Liberia">Liberia</option>
                            <option value="Libya">Libya</option>
                            <option value="Liechtenstein">Liechtenstein</option>
                            <option value="Lithuania">Lithuania</option>
                            <option value="Luxembourg">Luxembourg</option>
                            <option value="Macedonia">Macedonia</option>
                            <option value="Madagascar">Madagascar</option>
                            <option value="Malawi">Malawi</option>
                            <option value="Malaysia">Malaysia</option>
                            <option value="Maldives">Maldives</option>
                            <option value="Mali">Mali</option>
                            <option value="Malta">Malta</option>
                            <option value="Marshall Islands">
                              Marshall Islands
                            </option>
                            <option value="Mauritania">Mauritania</option>
                            <option value="Mauritius">Mauritius</option>
                            <option value="Mexico">Mexico</option>
                            <option value="Micronesia">Micronesia</option>
                            <option value="Moldova">Moldova</option>
                            <option value="Monaco">Monaco</option>
                            <option value="Mongolia">Mongolia</option>
                            <option value="Montenegro">Montenegro</option>
                            <option value="Morocco">Morocco</option>
                            <option value="Mozambique">Mozambique</option>
                            <option value="Myanmar, {Burma}">
                              Myanmar, &#123; Burma &rbrace;
                            </option>
                            <option value="Namibia">Namibia</option>
                            <option value="Nauru">Nauru</option>
                            <option value="Nepal">Nepal</option>
                            <option value="Netherlands">Netherlands</option>
                            <option value="New Zealand">New Zealand</option>
                            <option value="Nicaragua">Nicaragua</option>
                            <option value="Niger">Niger</option>
                            <option value="Nigeria">Nigeria</option>
                            <option value="Norway">Norway</option>
                            <option value="Oman">Oman</option>
                            <option value="Pakistan">Pakistan</option>
                            <option value="Palau">Palau</option>
                            <option value="Panama">Panama</option>
                            <option value="Papua New Guinea">
                              Papua New Guinea
                            </option>
                            <option value="Paraguay">Paraguay</option>
                            <option value="Peru">Peru</option>
                            <option value="Philippines">Philippines</option>
                            <option value="Poland">Poland</option>
                            <option value="Portugal">Portugal</option>
                            <option value="Qatar">Qatar</option>
                            <option value="Romania">Romania</option>
                            <option value="Russian Federation">
                              Russian Federation
                            </option>
                            <option value="Rwanda">Rwanda</option>
                            <option value="St Kitts &amp; Nevis">
                              St Kitts &amp; Nevis
                            </option>
                            <option value="St Lucia">St Lucia</option>
                            <option value="Saint Vincent &amp; the Grenadines">
                              Saint Vincent &amp; the Grenadines
                            </option>
                            <option value="Samoa">Samoa</option>
                            <option value="San Marino">San Marino</option>
                            <option value="Sao Tome &amp; Principe">
                              Sao Tome &amp; Principe
                            </option>
                            <option value="Saudi Arabia">Saudi Arabia</option>
                            <option value="Senegal">Senegal</option>
                            <option value="Serbia">Serbia</option>
                            <option value="Seychelles">Seychelles</option>
                            <option value="Sierra Leone">Sierra Leone</option>
                            <option value="Singapore">Singapore</option>
                            <option value="Slovakia">Slovakia</option>
                            <option value="Slovenia">Slovenia</option>
                            <option value="Solomon Islands">
                              Solomon Islands
                            </option>
                            <option value="Somalia">Somalia</option>
                            <option value="South Africa">South Africa</option>
                            <option value="South Sudan">South Sudan</option>
                            <option value="Spain">Spain</option>
                            <option value="Sri Lanka">Sri Lanka</option>
                            <option value="Sudan">Sudan</option>
                            <option value="Suriname">Suriname</option>
                            <option value="Swaziland">Swaziland</option>
                            <option value="Sweden">Sweden</option>
                            <option value="Switzerland">Switzerland</option>
                            <option value="Syria">Syria</option>
                            <option value="Taiwan">Taiwan</option>
                            <option value="Tajikistan">Tajikistan</option>
                            <option value="Tanzania">Tanzania</option>
                            <option value="Thailand">Thailand</option>
                            <option value="Togo">Togo</option>
                            <option value="Tonga">Tonga</option>
                            <option value="Trinidad &amp; Tobago">
                              Trinidad &amp; Tobago
                            </option>
                            <option value="Tunisia">Tunisia</option>
                            <option value="Turkey">Turkey</option>
                            <option value="Turkmenistan">Turkmenistan</option>
                            <option value="Tuvalu">Tuvalu</option>
                            <option value="Uganda">Uganda</option>
                            <option value="Ukraine">Ukraine</option>
                            <option value="United Arab Emirates">
                              United Arab Emirates
                            </option>
                            <option value="United Kingdom">
                              United Kingdom
                            </option>
                            <option value="United States">United States</option>
                            <option value="Uruguay">Uruguay</option>
                            <option value="Uzbekistan">Uzbekistan</option>
                            <option value="Vanuatu">Vanuatu</option>
                            <option value="Vatican City">Vatican City</option>
                            <option value="Venezuela">Venezuela</option>
                            <option value="Vietnam">Vietnam</option>
                            <option value="Yemen">Yemen</option>
                            <option value="Zambia">Zambia</option>
                            <option value="Zimbabwe">Zimbabwe</option>
                          </select>

                          <Field
                            className="form-control mb-3"
                            name="emailAddress"
                            value={props.values.emailAddress}
                            placeholder="Email Address"
                            type="email"
                            required
                          />

                          <Field
                            className="form-control mb-3"
                            name="site_Id"
                            placeholder="Site Id"
                            value={props.values.site_Id}
                          />

                          <Button
                            color="primary"
                            type="submit"
                            className="d-flex align-items-center"
                          >
                            Save
                            {/* <i className="simple-icon-save ml-2" /> */}
                          </Button>
                        </Col>
                        <Col>
                          <div>
                            {/* <GoogleMap defaultZoom={8} defaultCenter={latLng}>
                              <Marker position={latLng} />
                            </GoogleMap> */}
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </Colxx>
        </Row>
      </>
    );
  }
}
export default MerchantFormPage;
