import React from 'react';
import { Row, Button, Col } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import IntlMessages from '../../helpers/IntlMessages';
import { Colxx, Separator } from '../../components/common/CustomBootstrap';
import Breadcrumb from '../../containers/navs/Breadcrumb';
import axois from '../../axois';

class MerchantPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      merchants: [],
    };
    this.searchHadler = this.searchHadler.bind(this);
    this.deleteMerchant = this.deleteMerchant.bind(this);
    this.getMerchants = this.getMerchants.bind(this);
  }

  componentDidMount() {
    this.getMerchants();
  }

  getMerchants() {
    axois.get('Get').then((resData) => {
      this.setState({ merchants: resData.data });
    });
  }

  searchHadler(values) {
    axios.get(`Search/${values.name}`).then((resData) => {
      this.setState({
        merchants: resData.data,
      });
    });
  }

  deleteMerchant(id) {
    if (window.confirm('Are you sure want to delete?')) {
      axios.post(`Delete/${id}`).then(() => {
        this.getMerchants();
      });
    }
  }

  render() {
    const { merchants } = this.state;
    const { match } = this.props;
    return (
      <>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.merchant-page" match={match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs="12" className="mb-4">
            <p>
              <IntlMessages id="menu.merchant-page" />
            </p>
            <div className="mb-4 ml-auto col-4">
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
                    <Row form>
                      <Col>
                        <Field
                          className="form-control"
                          name="name"
                          placeholder="Search"
                        />
                      </Col>
                      <Col>
                        <Button
                          color="primary"
                          type="submit"
                          className="d-flex align-items-center"
                        >
                          Search
                          <i className="simple-icon-magnifier ml-2" />
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </div>
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Merchant ID</th>
                  <th>GoID</th>
                  <th>Terminal ID</th>
                  <th>Clerk ID</th>
                  <th>Business Name</th>
                  <th>Name</th>
                  <th>Country</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {merchants.map((item) => (
                  <tr key={`${item.id + item.User_GoID}row`}>
                    <td>{item.Merchant_ID}</td>
                    <td>{item.User_GoID}</td>
                    <td>{item.User_TerminalID}</td>
                    <td>{item.User_ClerkID}</td>
                    <td>{item.BusinessName}</td>
                    <td>{item.User_FirstName}</td>
                    <td>{item.RegionCountry}</td>
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
                        onClick={() => this.deleteMerchant(item.Id)}
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

export default MerchantPage;
