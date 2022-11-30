import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      {process.env.REACT_APP_TEST_ENV_VAR}
    </div>
  );
}

export default App;
