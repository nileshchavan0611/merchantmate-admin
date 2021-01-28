import React from 'react';
import { Row, Button, Col } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import IntlMessages from '../../helpers/IntlMessages';
import { Colxx, Separator } from '../../components/common/CustomBootstrap';
import Breadcrumb from '../../containers/navs/Breadcrumb';

const BlankPage = ({ match }) => {
  const onSubmit = (values) => {
    console.log(values);
  };

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
                email: '',
              }}
              onSubmit={onSubmit}
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
              {[...Array(10).keys()].map((item) => (
                <tr key={`${item}row`}>
                  <td>BigBucket</td>
                  <td>JA82574</td>
                  <td>23232323</td>
                  <td>232323</td>
                  <td>APPFINITY TECHNOLOGIES LIMITED</td>
                  <td>George Henry</td>
                  <td>Jamaica</td>
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
};

export default BlankPage;
