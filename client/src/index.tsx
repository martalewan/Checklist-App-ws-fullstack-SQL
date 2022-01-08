import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import './main.scss';
import { WebsocketHandler } from './services/WebsocketHandler';


declare global {
  interface Window { services: any; }
}

window.services = {
  wsHandler: new WebsocketHandler("ws://localhost:8080/ws/todo-list")
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
