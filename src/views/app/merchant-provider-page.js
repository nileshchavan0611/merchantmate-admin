import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { FormGroup, Label, Row, Button } from 'reactstrap';
import Select from 'react-select';
import IntlMessages from '../../helpers/IntlMessages';
import { Colxx, Separator } from '../../components/common/CustomBootstrap';
import Breadcrumb from '../../containers/navs/Breadcrumb';
import CustomSelectInput from '../../components/common/CustomSelectInput';

const selectData = [
  { label: 'Flow', value: 'flow', key: 0 },
  { label: 'Ready Credit', value: 'Ready Credit', key: 1 },
];

const BlankPage = ({ match }) => {
  const onSubmit = (values) => {
    console.log(values);
  };

  const [selectedOptions, setSelectedOptions] = useState([]);
  const validateName = (value) => {
    let error;
    if (!value) {
      error = 'Please enter your name';
    } else if (value.length < 2) {
      error = 'Value must be longer than 2 characters';
    }
    return error;
  };
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
              onSubmit={onSubmit}
            >
              {({ errors, touched }) => (
                <Form className="">
                  <FormGroup>
                    <Label>
                      Merchant Id <span className="text-danger">*</span>
                    </Label>
                    <Field
                      className="form-control"
                      name="name"
                      validate={validateName}
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
                      isMulti
                      name="form-field-name"
                      value={selectedOptions}
                      onChange={setSelectedOptions}
                      options={selectData}
                    />
                  </FormGroup>
                  <Button color="primary" type="submit">
                    Add
                  </Button>
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
              {[...Array(10).keys()].map((item) => (
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
};

export default BlankPage;
