import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux'

import './App.css';
import { reduxStore } from './store';
import { HomePage } from './pages/Home/Home';
import { SettingsPage } from './pages/Settings/Settings';

function App() {
  return (
    <div className="App">
      <Provider store={reduxStore}>
        <BrowserRouter>
          <Routes>
            <Route path="/library/albums" element={<HomePage/>}/>
            <Route path="/settings" element={<SettingsPage/>}/>
            <Route path="*" element={<Navigate to="/library/albums"/>}/>
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
