import React from 'react';
import {connect} from 'react-redux';

import {signIn, signOut} from '../../actions';
//to get the token API : auth.currentUser.get().getAuthResponse()

class Auth extends React.Component {

  componentDidMount(){
    window.gapi.load('client:auth2', () => {
      window.gapi.client.init({
        clientId:'1027296414176-djc1k46fvc08hs81vek0hb7na5v5cn2j.apps.googleusercontent.com',
        scope:'https://www.googleapis.com/auth/youtube.force-ssl'
      })
      .then( () => {
        this.auth = window.gapi.auth2.getAuthInstance();
        this.onAuthChange(this.auth.isSignedIn.get());
        this.auth.isSignedIn.listen(this.onAuthChange);
      })
      .catch((err) => {
        console.log(err);
      })
    });
  }

  onSignInClick = () => {
    if(this.auth) {
      this.auth.signIn();
    }
  };

  onSignOutClick = () => {
    if(this.auth) {
      this.auth.signOut();
    }
  };

  onAuthChange = (isSignedIn) => {
    if(isSignedIn) {
      const user = this.auth.currentUser.get();
      this.props.signIn(
        user.getAuthResponse().access_token,
        user.getBasicProfile().getName(),
        user.getBasicProfile().getImageUrl()
      );
    } else {
      this.props.signOut();
    }
  };

  render() {
    if(this.props.auth) {
      return(
        <div className= "right menu">
        {this.props.auth.isSignedIn?
          <button className="ui red google button" onClick ={this.onSignOutClick}>
            <i className="google icon" />
            Sign Out
          </button>
          :
            <button className="ui red google button" onClick ={this.onSignInClick}>
              <i className="google icon" />
              Sign In
            </button>
        }
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return { auth:state.auth};
};

export default connect(mapStateToProps,{ signIn, signOut })(Auth);
