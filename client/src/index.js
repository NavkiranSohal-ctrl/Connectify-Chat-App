import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import {Provider} from 'react-redux'
import { store } from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}> {/**component wraps your app with the Redux store. This allows your app to access the global state managed by Redux. The store object holds all the data and logic for your app’s state, making it available to any component that needs it. */}
    <RouterProvider router = {router}> {/**The router object is a routing configuration that determines which components to show based on the URL.  */}
  <App />
  </RouterProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
