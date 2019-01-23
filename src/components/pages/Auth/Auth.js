import React from 'react';
import { GoogleLoginButton } from 'react-social-login-buttons';
import './Auth.scss';

class Auth extends React.Component {
  render() {
    return (
      <div className="Auth my-5">
        <div className="d-flex justify-content-center mt-r">
          <GoogleLoginButton />
        </div>
      </div>
    );
  }
}

export default Auth;
