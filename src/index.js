import React from "react";
import "react-quill/dist/quill.snow.css";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import "./style.css";
import ReactDOM from 'react-dom'
import App from "./App.js"
import { reducers } from './reducers';
import thunk from 'redux-thunk';
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const store = createStore(reducers, compose(applyMiddleware(thunk)));

ReactDOM.render(
  <Provider store={store}>
  <QueryClientProvider client={queryClient}>
  
  <React.StrictMode>
      <App />
  </React.StrictMode>

  </QueryClientProvider>
  </Provider>
  ,

  document.getElementById('root') || document.createElement('div')
);