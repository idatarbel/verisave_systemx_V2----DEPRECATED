
import './App.css';
import Header from './Components/Header';

import React, {Component} from 'react';
import { withOktaAuth } from '@okta/okta-react';


export default withOktaAuth(class Home extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);   
  }

  async login() {
    await this.props.oktaAuth.signInWithRedirect();
  }

  async logout() {
    await this.props.oktaAuth.signOut();
  }

  render() {
    return (
        <>
            <Header 
                userName={ this.props.authState.idToken.claims.name} 
                isAuthenticated={this.props.authState?.isAuthenticated}
                oktaAuth={this.props.oktaAuth}>
            </Header>
        </>
    );
  }
});