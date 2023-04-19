import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Title(props) {
  return (
    <div className="title-container">
      <h1 className="title">{props.title}</h1>
      <p className="subtitle">{props.subtitle}</p>
    </div>
  );
}



root.render(
  <React.StrictMode>
    <Title title="Hemorrhage Segmentation" subtitle="Insert an image of a brain below to see if our model can detect hemorrhaging." />
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
