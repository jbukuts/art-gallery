import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Helmet } from 'react-helmet'
// import reportWebVitals from './reportWebVitals';

const TITLE = "The Gallery";
document.title = TITLE;

ReactDOM.render(
  <React.StrictMode>
    <Helmet>
      <title>{ TITLE }</title>
    </Helmet>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
