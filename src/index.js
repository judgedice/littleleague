import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import {Provider} from 'react-redux'
import store from './store'
import router from './router'
import registerServiceWorker from './registerServiceWorker';


window.store = store;
 
ReactDOM.render(
    <Provider store={store}>{ router }</Provider>,
    document.getElementById('root')
  );

  registerServiceWorker(); 