import React, { Component } from 'react';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, Security, SecureRoute } from '@okta/okta-react';
import Home from './Home';
// import Statements from './Statements';

const REACT_APP_OKTA_ISSUER=process.env.REACT_APP_OKTA_ISSUER; 
const REACT_APP_OKTA_CLIENTID=process.env.REACT_APP_OKTA_CLIENTID; 

const oktaAuth = new OktaAuth({
  issuer: REACT_APP_OKTA_ISSUER,
  clientId: REACT_APP_OKTA_CLIENTID,
  redirectUri: window.location.origin + '/login/callback'
});

class App extends Component {

  constructor(props) {
    super(props);
    this.restoreOriginalUri = async (_oktaAuth, originalUri) => {
      props.history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
    };
  }

  render() {
    return (
      <Security oktaAuth={oktaAuth} restoreOriginalUri={this.restoreOriginalUri}>
        <SecureRoute path="/" exact={true} component={Home}/>
        {/* <SecureRoute path="/statements" exact={true} component={Statements}/> */}
        <Route path="/login/callback" component={LoginCallback}/>
      </Security>
    );
  }
}

const AppWithRouterAccess = withRouter(App);

class RouterApp extends Component {
  render() {
    return (<Router><AppWithRouterAccess/></Router>);
  }
}

export default RouterApp;