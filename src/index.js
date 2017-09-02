import React from "react";
import ReactDOM from "react-dom";
// import App from './App';
import { Provider } from "react-redux";
import store from "./store";
import router from "./router";
import registerServiceWorker from "./registerServiceWorker";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import injectTapEventPlugin from "react-tap-event-plugin";

injectTapEventPlugin();

window.store = store;

ReactDOM.render(
  <MuiThemeProvider>
    <Provider store={store}>{router}</Provider>
  </MuiThemeProvider>,
  document.getElementById("root")
);

registerServiceWorker();
