import { ipcRenderer } from 'electron';
import { bindActionCreators } from 'redux';
import * as ActionCreators from './actions';

export default function setupListener(store, history) {
  const actions = bindActionCreators(ActionCreators, store.dispatch);
}
