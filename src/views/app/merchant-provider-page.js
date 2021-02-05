import React from 'react';
import { Formik, Form, Field } from 'formik';
import { FormGroup, Label, Row, Button } from 'reactstrap';
import Select from 'react-select';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import IntlMessages from '../../helpers/IntlMessages';
import { Colxx, Separator } from '../../components/common/CustomBootstrap';
import Breadcrumb from '../../containers/navs/Breadcrumb';
import CustomSelectInput from '../../components/common/CustomSelectInput';
import axois from '../../axois';

class MerchantProviderPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      merchantProviders: [],
      selectedValue: '',
      providers: [],
    };
    this.searchHadler = this.searchHadler.bind(this);
    this.deleteMerchantProvider = this.deleteMerchantProvider.bind(this);
    this.getMerchants = this.getMerchants.bind(this);
  }

  componentDidMount() {
    this.getMerchants();
    this.getProviders();
  }

  getMerchants() {
    axois
      .get('Merchants/api/Merchants/GetMerchantProviders')
      .then((resData) => {
        this.setState({ merchantProviders: resData.data });
      });
  }

  getProviders() {
    axois.get('Merchants/api/Merchants/GetProviders').then((resData) => {
      this.setState({
        providers: resData.data.map((item) => {
          return {
            label: item.name,
            value: item.id,
            key: item.id,
          };
        }),
      });
    });
  }

  onSubmit = (values) => {
    console.log(values);
  };

  validateName = (value) => {
    let error;
    if (!value) {
      error = 'Please enter your name';
    } else if (value.length < 2) {
      error = 'Value must be longer than 2 characters';
    }
    return error;
  };

  saveMerchantProvider = () => {
    const { merchantID, providerId } = this.state;
    return axois
      .post(`Merchants/api/Merchants/CreateMerchantProvider`, {
        id: '0',
        provider_Id: providerId.value,
        merchant_ID: merchantID,
      })
      .then((resp) => {
        /* eslint-disable-line camelcase */
        console.log('save data', resp);
        this.getMerchants();
      });
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

  handleSelectChange = (data) => {
    this.setState({ providerId: data });
  };

  handleInputChange = (query) => {
    this.setState({ query });
  };

  menuItemClickHandler = (str) => {
    if (str[0]) {
      this.setState({ merchantID: str[0].id });
    }
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

  deleteMerchantProvider(id) {
    if (window.confirm('Are you sure want to delete?')) {
      axois
        .post(`Merchants/api/Merchants/DeleteMerchantProvider/${id}`)
        .then(() => {
          this.getMerchants();
        });
    }
  }

  searchHadler(values) {
    axois
      .get(`Merchants/api/Merchants/SearchMerchantProviders/${values.name}`)
      .then((resData) => {
        this.setState({
          merchantProviders: resData.data,
        });
      });
  }

  render() {
    const { merchantProviders, providerId, providers } = this.state;
    const { match } = this.props;
    return (
      <>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.merchant-provider-page" match={match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs="12" className="mb-4">
            <p>
              <IntlMessages id="menu.merchant-provider-page" />
            </p>
            <div className="mb-4 col-4">
              <Formik
                initialValues={{
                  name: '',
                  email: '',
                }}
                onSubmit={this.saveMerchantProvider}
              >
                {({ errors, touched }) => (
                  <Form className="">
                    <FormGroup>
                      <Label>
                        Merchant Id <span className="text-danger">*</span>
                      </Label>

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
                      {errors.name && touched.name && (
                        <div className="invalid-feedback d-block">
                          {errors.name}
                        </div>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <Label>
                        <IntlMessages id="form-components.provider" />
                      </Label>
                      <Select
                        components={{ Input: CustomSelectInput }}
                        className="react-select"
                        classNamePrefix="react-select"
                        name="form-field-name"
                        value={providerId}
                        onChange={this.handleSelectChange}
                        options={providers}
                      />
                    </FormGroup>
                    <Button color="primary" type="submit">
                      Add
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="mb-4 ml-auto col-4 text-right">
              <Formik
                initialValues={{
                  name: '',
                }}
                onSubmit={(values, { setSubmitting }) => {
                  setTimeout(() => {
                    this.searchHadler(values);
                    setSubmitting(false);
                  }, 400);
                }}
              >
                {() => (
                  <Form className="">
                    <Row form className="flex-nowrap">
                      <Field
                        className="form-control mr-2"
                        name="name"
                        placeholder="Search"
                      />
                      <Button
                        color="primary"
                        type="submit"
                        className="d-flex align-items-center"
                      >
                        Search
                        <i className="simple-icon-magnifier ml-2" />
                      </Button>
                    </Row>
                  </Form>
                )}
              </Formik>
            </div>
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Merchant ID</th>
                  <th>Business Name</th>
                  <th>Provider Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {merchantProviders.map((item) => (
                  <tr key={`${item}row`}>
                    <td>Walmart</td>
                    <td>Walmart Inc</td>
                    <td>Ready Credit</td>
                    <td>
                      <button
                        className="btn btn-xs btn-danger mx-1"
                        type="button"
                      >
                        <i className="simple-icon-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Colxx>
        </Row>
      </>
    );
  }
}

export default MerchantProviderPage;
