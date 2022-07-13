import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import PageController from './View/PageController';
import Controller from './Controller/Controller';
import './assets/fonts/3DHandDrawns.ttf';


const root = ReactDOM.createRoot(document.getElementById('root'));
const controllore = new Controller();
console.log("Instanzio nuovo controller");
root.render(
  <React.StrictMode>
    <PageController controller = {controllore}/>
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
