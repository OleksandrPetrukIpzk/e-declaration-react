import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {persistor, store} from "./redux/store";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
      </PersistGate>
    </Provider>
);

