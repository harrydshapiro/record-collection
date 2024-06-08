import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";

import "./App.css";
import { store } from "./store/index";
import { HomePage } from "./pages/Home/Home";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/library/albums" element={<HomePage />} />
            <Route path="*" element={<Navigate to="/library/albums" />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
