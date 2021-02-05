import React from 'react';
import { Row, Button } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { Link } from 'react-router-dom';
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
    axois.get('Merchants/api/Merchants/Get').then((resData) => {
      this.setState({ merchants: resData.data });
    });
  }

  searchHadler(values) {
    if (values.name) {
      axois
        .get(`Merchants/api/Merchants/Search/${values.name}`)
        .then((resData) => {
          this.setState({ merchants: [] });
          this.setState({
            merchants: resData.data,
          });
          this.setState({});
        });
    } else {
      this.getMerchants();
    }
  }

  deleteMerchant(id) {
    if (window.confirm('Are you sure want to delete?')) {
      axois.get(`Merchants/api/Merchants/Delete/${id}`).then(() => {
        this.getMerchants();
      });
    }
  }

  render() {
    const { merchants } = this.state;
    console.log('merchants', merchants);
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
          <Colxx xxs="12" className="text-right">
            <Link
              as="button"
              className="btn btn-sm btn-success mr-3"
              to={`${match.url}/merchant-form-page`}
            >
              <i className="simple-icon-plus mr-2" />
              Add
            </Link>
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs="12" className="mb-4">
            <p>
              <IntlMessages id="menu.merchant-page" />
            </p>
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
                  <tr key={`${item.id + item.user_id}row`}>
                    <td>{item.merchant_ID}</td>
                    <td>{item.user_GoID}</td>
                    <td>{item.user_TerminalID}</td>
                    <td>{item.user_ClerkID}</td>
                    <td>{item.businessName}</td>
                    <td>{item.user_FirstName}</td>
                    <td>{item.regionCountry}</td>
                    <td>
                      <Link
                        className="btn btn-xs btn-primary mx-1"
                        as="button"
                        to={`/app/merchant-page/merchant-form-page/${item.merchant_ID}`}
                      >
                        <i className="simple-icon-pencil" />
                      </Link>
                      <button
                        className="btn btn-xs btn-danger mx-1"
                        type="button"
                        onClick={() => this.deleteMerchant(item.id)}
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
