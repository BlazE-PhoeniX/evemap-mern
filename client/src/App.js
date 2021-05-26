import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CSSTransition from "react-transition-group/CSSTransition";
import { checkLogin } from "./store/auth";
import { getCoords } from "./store/coords";

import "./App.css";
import Layout from "./components/layout/Layout";
import Alert from "./components/ui/Alert";
import Loader from "./components/ui/Loader";
import CoordsGetter from "./components/ui/CoordsGetter";
import Events from "./pages/Events";
import MobileNav from "./components/mobilenav/MobileNav";

const Signup = React.lazy(() => import("./pages/Signup"));
const Login = React.lazy(() => import("./pages/Login"));
const UserAccount = React.lazy(() => import("./pages/UserAccount"));
const PasswordChange = React.lazy(() => import("./pages/PasswordChange"));
const PasswordForget = React.lazy(() => import("./pages/PasswordForget"));
const PasswordReset = React.lazy(() => import("./pages/PasswordReset"));

function App() {
  const dispatchRedux = useDispatch();
  const user = useSelector(state => state.auth.user);
  const alert = useSelector(state => state.ui.alert);
  const loader = useSelector(state => state.ui.loader);
  const coordsGetter = useSelector(state => state.ui.coordsGetter);
  const mobileNav = useSelector(state => state.ui.mobileNav);

  useEffect(() => {
    dispatchRedux(getCoords());

    (async () => {
      dispatchRedux(checkLogin());
    })();
  }, [dispatchRedux]);

  const fallback = <Loader />;

  return (
    <Layout>
      <Suspense fallback={fallback}>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/events" />
          </Route>
          <Route path="/events">
            <Events />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/forget-password">
            <PasswordForget />
          </Route>
          <Route path="/reset-password/:token">
            <PasswordReset />
          </Route>
          {user && (
            <Route path="/me">
              <UserAccount />
            </Route>
          )}
          {user && (
            <Route path="/change-password">
              <PasswordChange />
            </Route>
          )}
          <Route path="*">
            <Redirect to="/events" />
          </Route>
        </Switch>
      </Suspense>
      <CSSTransition
        in={alert.show}
        mountOnEnter
        unmountOnExit
        timeout={150}
        classNames="alert">
        <Alert type={alert.type} message={alert.message} />
      </CSSTransition>
      <CSSTransition
        in={loader.show}
        mountOnEnter
        unmountOnExit
        timeout={100}
        classNames="loader">
        <Loader />
      </CSSTransition>
      <CSSTransition
        in={coordsGetter.show}
        mountOnEnter
        unmountOnExit
        timeout={300}
        classNames="coords-getter">
        <CoordsGetter />
      </CSSTransition>
      <CSSTransition
        in={mobileNav.show}
        mountOnEnter
        unmountOnExit
        timeout={500}
        classNames="mobile-nav">
        <MobileNav />
      </CSSTransition>
    </Layout>
  );
}

export default App;
