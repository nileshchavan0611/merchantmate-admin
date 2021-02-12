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
      notifications: [],
    };
    this.deleteNotification = this.deleteNotification.bind(this);
    this.getNotifications = this.getNotifications.bind(this);
  }

  componentDidMount() {
    this.getNotifications();
  }

  getNotifications() {
    axois.get('Merchants/api/Merchants/GetAllNotification').then((resData) => {
      this.setState({ notifications: resData.data });
    });
  }

  deleteNotification(id) {
    if (window.confirm('Are you sure want to delete?')) {
      axois.get(`Merchants/api/Merchants/DeleteNotification/${id}`).then(() => {
        this.getNotifications();
      });
    }
  }

  searchHadler(values) {
    if (values.name) {
      axois
        .get(`Merchants/api/Merchants/GetNotificationByAny/${values.name}`)
        .then((resData) => {
          this.setState({ notifications: [] });
          this.setState({
            notifications: resData.data,
          });
          this.setState({});
        });
    } else {
      this.getMerchants();
    }
  }

  render() {
    const { notifications } = this.state;
    console.log('notifications', notifications);
    const { match } = this.props;
    return (
      <>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.notification-page" match={match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs="12" className="text-right">
            <Link
              as="button"
              className="btn btn-sm btn-success mr-3"
              to={`${match.url}/notification-form-page`}
            >
              <i className="simple-icon-plus mr-2" />
              Add
            </Link>
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs="12" className="mb-4">
            <p>
              <IntlMessages id="menu.notification-page" />
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
                  <th>Notification ID</th>
                  <th>Name</th>
                  <th>description</th>
                  <th>Country</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((item) => (
                  <tr key={`${item.id + item.user_id}row`}>
                    <td>{item.notificationId}</td>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{item.country}</td>
                    <td>{item.dateCreated}</td>
                    <td>
                      <Link
                        className="btn btn-xs btn-primary mx-1"
                        as="button"
                        to={`/app/notification-page/notification-form-page/${item.notificationId}`}
                      >
                        <i className="simple-icon-pencil" />
                      </Link>
                      <button
                        className="btn btn-xs btn-danger mx-1"
                        type="button"
                        onClick={() =>
                          this.deleteNotification(item.notificationId)
                        }
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
