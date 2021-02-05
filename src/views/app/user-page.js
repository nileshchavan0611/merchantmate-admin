/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React from 'react';
import { Formik, Form } from 'formik';
import { FormGroup, Label, Row, Button } from 'reactstrap';
import Select from 'react-select';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { Link } from 'react-router-dom';
import IntlMessages from '../../helpers/IntlMessages';
import { Colxx, Separator } from '../../components/common/CustomBootstrap';
import Breadcrumb from '../../containers/navs/Breadcrumb';
import CustomSelectInput from '../../components/common/CustomSelectInput';
import axois from '../../axois';

class MerchantProviderPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      selectedValue: '',
      roles: [],
    };
    this.searchHadler = this.searchHadler.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.getMerchants = this.getMerchants.bind(this);
  }

  componentDidMount() {
    this.getMerchants();
    this.setState({
      roles: ['Supervisor', 'Merchant Admin', 'Clerk', 'Interlinc Agent'].map(
        (item) => {
          return {
            label: item,
            value: item,
            key: item,
          };
        }
      ),
    });
  }

  getMerchants() {
    axois.get('Merchants/api/Merchants/Get').then((resData) => {
      this.setState({ users: resData.data || [] });
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

  deleteUser(id) {
    if (window.confirm('Are you sure want to delete?')) {
      axois.get(`Merchants/api/Merchants/DeleteTerminal/${id}`).then(() => {
        this.getMerchants();
      });
    }
  }

  searchHadler(values) {
    axois
      .get(`Merchants/api/Merchants/Searchusers/${values.name}`)
      .then((resData) => {
        this.setState({
          users: resData.data,
        });
      });
  }

  render() {
    const { users, providerId, roles } = this.state;
    const { match } = this.props;
    return (
      <>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.user-page" match={match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs="12" className="text-right">
            <Link
              as="button"
              className="btn btn-sm btn-success mr-3"
              to={`${match.url}/user-form-page`}
            >
              <i className="simple-icon-plus mr-2" />
              Add
            </Link>
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs="12" className="mb-4">
            <p>
              <IntlMessages id="menu.user-page" />
            </p>
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Business Name</th>
                  <th>Terminal ID</th>
                  <th>Clerk ID</th>
                  <th>User ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={`${item}row`}>
                    <td>{item.businessName}</td>
                    <td>{item.user_TerminalID}</td>
                    <td>{item.user_ClerkID}</td>
                    <td>{item.user_UserID}</td>
                    <td>{item.user_FirstName}</td>
                    <td>{item.user_LastName}</td>
                    <td>
                      <button
                        className="btn btn-xs btn-primary mx-1"
                        type="button"
                      >
                        <i className="simple-icon-pencil" />
                      </button>
                      <button
                        className="btn btn-xs btn-danger mx-1"
                        type="button"
                        onClick={() => this.deleteUser(item.user_id)}
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
