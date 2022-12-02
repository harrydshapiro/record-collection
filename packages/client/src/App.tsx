import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux'

import './App.css';
import { Signup } from './pages/Signup/Signup';
import { Admin } from './pages/Admin';
import { reduxStore } from './store';

function App() {
  return (
    <div className="App">
      <Provider store={reduxStore}>
        <BrowserRouter>
          <Routes>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/admin' element={<Admin/>}/>
            <Route path="*" element={<Navigate to="/signup"/>}/>
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
