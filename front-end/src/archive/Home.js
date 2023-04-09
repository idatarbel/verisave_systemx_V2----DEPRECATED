import React, {Component} from 'react';
import { withOktaAuth } from '@okta/okta-react';
import './App.css';
import Header from './Components/Header';
import Footer from './Components/Footer';

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
          oktaAuth={this.props.oktaAuth}></Header>

          <div className="container" id="page-container">
            <div className="pricing-header px-3 py-3 pt-md-1 pb-md-4 mx-auto text-center">
              <h1 className="display-6">System X</h1>
              <p className="lead">
                Welcome to System X.

              </p>
            </div>
          </div>

        <Footer></Footer>
      </>
    );
  }
});