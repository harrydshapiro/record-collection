import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './App.css';
import { Signup } from './pages/Signup/Signup';
import { Admin } from './pages/Admin/Admin';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/admin' element={<Admin/>}/>
          <Route path="*" element={<Navigate to="/signup"/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
