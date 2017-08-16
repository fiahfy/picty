import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const styles = {
};

function mapStateToProps(state) {
  return { ...state.mainContainer };
}

function mapDispatchToProps() {
  return {};
}

@connect(mapStateToProps, mapDispatchToProps)
export default class MainContainer extends Component {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };
  static propTypes = {
  };
  state = {};
  render() {
    return (
      <span>OK</span>
    );
  }
}
