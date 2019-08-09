// @flow
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { session, eventEmitter, loginCounter, il8n } from '../index';
import Redirector from './Redirector';

type Props = {};

type State = {
  importCompleted: boolean,
  userOpenedDifferentWallet: boolean,
  darkMode: boolean,
  walletFile: string,
  wrongPassword: boolean
};

export default class Login extends Component<Props, State> {
  props: Props;

  constructor(props?: Props) {
    super(props);
    this.state = {
      importCompleted: false,
      userOpenedDifferentWallet: false,
      darkMode: session.darkMode || false,
      walletFile: session.walletFile,
      wrongPassword: loginCounter.userLoginAttempted
    };
    this.handleInitialize = this.handleInitialize.bind(this);
    this.refreshLogin = this.refreshLogin.bind(this);
  }

  componentDidMount() {
    eventEmitter.on('initializeNewSession', this.handleInitialize);
    eventEmitter.on('refreshLogin', this.refreshLogin);
  }

  componentWillUnmount() {
    eventEmitter.off('initializeNewSession', this.handleInitialize);
    eventEmitter.off('refreshLogin', this.refreshLogin);
  }

  refreshLogin = () => {
    this.setState({
      userOpenedDifferentWallet: true
    });
  };

  handleInitialize = () => {
    this.setState({
      importCompleted: true
    });
  };

  async handleSubmit(event: any) {
    // We're preventing the default refresh of the page that occurs on form submit
    event.preventDefault();
    loginCounter.userLoginAttempted = true;
    eventEmitter.emit('loginInProgress');
    const password = event.target[0].value;
    if (password === undefined) {
      return;
    }
    eventEmitter.emit('initializeNewSession', password);
  }

  render() {
    const {
      userOpenedDifferentWallet,
      importCompleted,
      darkMode,
      wrongPassword,
      walletFile
    } = this.state;

    if (userOpenedDifferentWallet) {
      return <Redirect to="/" />;
    }
    if (importCompleted === true) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <Redirector />
        {darkMode === false && (
          <div className="fullwindow">
            <div className="mid-div">
              <div
                className={
                  wrongPassword
                    ? 'box loginbox-fail has-background-light inner-div'
                    : 'box loginbox has-background-light inner-div'
                }
              >
                <form onSubmit={this.handleSubmit}>
                  <div className="field">
                    <label className="label" htmlFor="scanheight">
                      {il8n.password}
                      <div className="control">
                        <input
                          ref={input => input && input.focus()}
                          className={
                            wrongPassword
                              ? 'input is-large is-danger'
                              : 'input is-large'
                          }
                          type="password"
                          placeholder={il8n.password_input_placeholder}
                        />
                      </div>
                    </label>
                    <label
                      className="help"
                      htmlFor="scanheight"
                      id="help for scan height field"
                    >
                      {il8n.attempting_login_to}
                      {walletFile}
                    </label>
                  </div>
                  <div className="buttons is-right">
                    <button
                      type="submit"
                      className="button is-success is-large"
                    >
                      {il8n.login}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {darkMode === true && (
          <div className="fullwindow has-background-dark outer-div">
            <div className="mid-div">
              <div
                className={
                  wrongPassword
                    ? 'box loginbox-fail has-background-black inner-div'
                    : 'box loginbox has-background-black inner-div'
                }
              >
                <form onSubmit={this.handleSubmit}>
                  <div className="field">
                    <label
                      className="label has-text-white"
                      htmlFor="scanheight"
                    >
                      {il8n.password}
                      <div className="control">
                        <input
                          ref={input => input && input.focus()}
                          className={
                            wrongPassword
                              ? 'input is-large is-danger'
                              : 'input is-large'
                          }
                          type="password"
                          placeholder={il8n.password_input_placeholder}
                        />
                      </div>
                    </label>
                    <label className="help has-text-white" htmlFor="scanheight">
                      {il8n.attempting_login_to}
                      {walletFile}
                    </label>
                  </div>
                  <div className="buttons is-right">
                    <button
                      type="submit"
                      className="button is-success is-large"
                    >
                      {il8n.login}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
