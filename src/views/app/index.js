import React, { Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';
// import { ProtectedRoute, UserRole } from '../../helpers/authHelper';

const Gogo = React.lazy(() =>
  import(/* webpackChunkName: "viwes-gogo" */ './gogo')
);
const SecondMenu = React.lazy(() =>
  import(/* webpackChunkName: "viwes-second-menu" */ './second-menu')
);
const BlankPage = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './blank-page')
);
const MerchantPage = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './merchant-page')
);
const MerchantFormPage = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './merchant-form-page')
);
const MerchantProviderPage = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './merchant-provider-page')
);

const UserPage = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './user-page')
);

const UserFormPage = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './user-form-page')
);
const NotificationPage = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './notification-page')
);
const NotificationFormPage = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './notification-form-page')
);

const App = ({ match }) => {
  return (
    <AppLayout>
      <div className="dashboard-wrapper">
        <Suspense fallback={<div className="loading" />}>
          <Switch>
            <Redirect
              exact
              from={`${match.url}/`}
              to={`${match.url}/merchant-page`}
            />
            <Route
              path={`${match.url}/gogo`}
              render={(props) => <Gogo {...props} />}
            />
            <Route
              path={`${match.url}/second-menu`}
              render={(props) => <SecondMenu {...props} />}
            />
            {/* <ProtectedRoute
                    path={`${match.url}/second-menu`}
                    component={SecondMenu}
                    roles={[UserRole.Admin]}
            /> */}
            <Route
              path={`${match.url}/blank-page`}
              render={(props) => <BlankPage {...props} />}
            />
            <Route
              path={`${match.url}/merchant-page/merchant-form-page/:merchantID`}
              render={(props) => <MerchantFormPage {...props} />}
            />
            <Route
              path={`${match.url}/merchant-page/merchant-form-page`}
              exact
              render={(props) => <MerchantFormPage {...props} />}
            />
            <Route
              path={`${match.url}/merchant-page`}
              render={(props) => <MerchantPage {...props} />}
            />
            <Route
              path={`${match.url}/merchant-provider-page`}
              render={(props) => <MerchantProviderPage {...props} />}
            />
            <Route
              path={`${match.url}/user-page/user-form-page/edit/:terminalID/:merchantID`}
              render={(props) => <UserFormPage {...props} />}
            />
            <Route
              path={`${match.url}/user-page/user-form-page/add/:merchantID`}
              render={(props) => <UserFormPage {...props} />}
            />
            <Route
              path={`${match.url}/user-page/user-form-page`}
              render={(props) => <UserFormPage {...props} />}
            />
            <Route
              path={`${match.url}/user-page/:goId`}
              render={(props) => <UserPage {...props} />}
            />
            <Route
              path={`${match.url}/user-page`}
              render={(props) => <UserPage {...props} />}
            />
            <Route
              path={`${match.url}/notification-page/notification-form-page/:notificationID`}
              render={(props) => <NotificationFormPage {...props} />}
            />
            <Route
              path={`${match.url}/notification-page/notification-form-page`}
              exact
              render={(props) => <NotificationFormPage {...props} />}
            />
            <Route
              path={`${match.url}/notification-page`}
              render={(props) => <NotificationPage {...props} />}
            />

            {/* <Redirect to="/error" /> */}
          </Switch>
        </Suspense>
      </div>
    </AppLayout>
  );
};

const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(connect(mapStateToProps, {})(App));
