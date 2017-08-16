import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { routerReducer as router } from 'react-router-redux';
import reduceReducers from 'reduce-reducers';
import * as ActionTypes from '../actions';


export default reduceReducers(
  combineReducers({
    router,
  }),
  handleActions({
  }, {}),
);
