import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import HealthScoreCalculator from './app';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HealthScoreCalculator />
  </React.StrictMode>
);
