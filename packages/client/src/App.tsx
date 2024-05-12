import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux'

import './App.css';
import { Signup } from './pages/Signup/Signup';
import { AdminMessages } from './pages/AdminMessages';
import { reduxStore } from './store';
import { SubmissionRequestScheduler } from './pages/SubmissionRequestScheduler';

function App() {
  return (
    <div className="App">
      <Provider store={reduxStore}>
        <BrowserRouter>
          <Routes>
            {/* <Route path="*" element={<Navigate to="/signup"/>}/> */}
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
