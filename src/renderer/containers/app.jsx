import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Drawer, Menu, MenuItem, Snackbar } from 'material-ui';
import { ActionList, ActionSettings } from 'material-ui/svg-icons';
import {
  MuiThemeProvider, getMuiTheme,
  lightBaseTheme, darkBaseTheme,
} from 'material-ui/styles';
import * as ActionCreators from '../actions';

const styles = {
  app: {
    height: '100%',
  },
  drawer: {
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    boxShadow: 'none',
    boxSizing: 'content-box',
  },
  container: {
    height: '100%',
    paddingLeft: '49px',
  },
  snackbar: {
    textAlign: 'center',
  },
};

function mapStateToProps(state) {
  return {
    settings: state.settings,
    messages: state.messages,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ActionCreators, dispatch) };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };
  static propTypes = {
    children: PropTypes.node.isRequired,
    actions: PropTypes.object.isRequired,
  };
  static handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy'; // eslint-disable-line no-param-reassign
  }
  static menus = [
    { pathname: '/', IconClass: ActionList },
    { pathname: '/settings', IconClass: ActionSettings },
  ];
  render() {
    const { children } = this.props;
    // const theme = settings.theme === 'dark' ? darkBaseTheme : lightBaseTheme;
    const theme = null;

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <div style={styles.container}>
            {children}
          </div>
      </MuiThemeProvider>
    );
  }
}
