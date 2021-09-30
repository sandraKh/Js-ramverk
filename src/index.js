import React from "react";
import "react-quill/dist/quill.snow.css";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import "./style.css";
import ReactDOM from 'react-dom'
import App from "./App.js"
import { reducers } from './reducers';
import thunk from 'redux-thunk';


const store = createStore(reducers, compose(applyMiddleware(thunk)));

ReactDOM.render(
  <Provider store={store}>
  <React.StrictMode>
      <App />
  </React.StrictMode>
  </Provider>,
  document.getElementById('root') || document.createElement('div')
);