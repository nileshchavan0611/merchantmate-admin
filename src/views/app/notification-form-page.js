/* eslint-disable no-unused-vars */
import React from 'react';
import { Row, Button, Col } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import IntlMessages from '../../helpers/IntlMessages';
import { Colxx, Separator } from '../../components/common/CustomBootstrap';
import Breadcrumb from '../../containers/navs/Breadcrumb';
import axois from '../../axois';
// import axois from '../../axois';

class NotificationFormPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationID: '',
      country: '',
      formData: {
        name: '',
        description: '',
        country: '',
      },
      errorMsg: '',
    };
    this.saveNotification = this.saveNotification.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    if (match.params.notificationID) {
      this.getNotificationDetails(match.params.notificationID);
    }
  }

  getNotificationDetails = (query) => {
    return axois(`Merchants/api/Merchants/GetNotificationById/${query}`).then(
      (resp) => {
        /* eslint-disable-line camelcase */
        console.log('rep', resp);
        const notificationData = resp.data[0];

        this.setState({
          notificationID: query,
          errorMsg: '',
        });
        if (notificationData) {
          this.setState({
            formData: notificationData,
            country: notificationData.country,
          });
        }
      }
    );
  };

  saveNotification = (values) => {
    const { notificationID, address, country, formData } = this.state;
    const { history } = this.props;

    if (notificationID) {
      return axois
        .post(`/Merchants/api/Merchants/UpdateNotification`, {
          notificationId: notificationID,
          name: values.name,
          description: values.description,
          country,
        })
        .then((resp) => {
          /* eslint-disable-line camelcase */
          console.log('save data', resp);
          history.push('/app/notification-page');
        });
    }
    return axois
      .post(`/Merchants/api/Merchants/AddNotification`, {
        notificationId: notificationID,
        name: values.name,
        description: values.description,
        country,
      })
      .then((resp) => {
        /* eslint-disable-line camelcase */
        console.log('save data', resp);
        history.push('/app/notification-page');
      });
  };

  clearStateData = () => {
    this.setState({
      formData: {
        name: '',
        description: '',
        country: '',
      },
      country: '',
    });
  };

  handleRegionChange = (event) => {
    console.log('event', event);
    this.setState({ country: event.target.value });
  };

  render() {
    const { match } = this.props;
    const { formData, country, query, errorMsg } = this.state;
    console.log(formData);
    console.log(match, query);
    return (
      <>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.notification-form-page" match={match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs="12" className="mb-4">
            <p>
              <IntlMessages id="menu.notification-form-page" />
            </p>
            {errorMsg && <p className="error-msg">{errorMsg}</p>}
            <div className="">
              <Formik
                initialValues={formData}
                onSubmit={(values, { setSubmitting }) => {
                  setTimeout(() => {
                    console.log(values);
                    this.saveNotification(values);
                    setSubmitting(false);
                  }, 400);
                }}
                enableReinitialize
              >
                {(props) => {
                  return (
                    <Form className="">
                      <Row>
                        <Col>
                          <Field
                            className="form-control mb-3"
                            name="name"
                            value={props.values.name}
                            placeholder="Name"
                            required
                          />
                          <Field
                            className="form-control mb-3"
                            name="description"
                            value={props.values.description}
                            placeholder="description"
                            required
                          />

                          <select
                            className="form-control mb-3"
                            value={country}
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
                          <div />
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
export default NotificationFormPage;
