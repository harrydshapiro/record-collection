import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./App.css";
import { HomePage } from "./pages/Home/Home";
import { PlayerDispatchContext, PlayerProvider } from "./state/player.context";
import { LibraryContext } from "./state/library.context";
import { useContext, useEffect } from "react";
import { PlayerStateSSEConnection } from "./api/client";

function App() {
  const playerDispatchContext = useContext(PlayerDispatchContext);
  const playerDispatchContextExists = !!playerDispatchContext;

  useEffect(() => {
    if (playerDispatchContextExists) {
      PlayerStateSSEConnection.addMessageHandler((update) => {
        playerDispatchContext({ type: "", payload: update });
      });
    }
  }, [playerDispatchContextExists]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/library/albums" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/library/albums" />} />
      </Routes>
    </BrowserRouter>
  );
}

// Had to add the providers in as a parent so that in the child App component
// we can susbcribe to the SSE connection and publish its events to the contexts
function AppWithProviders() {
  return (
    <div className="App">
      <LibraryContext.Provider value={{ albums: [] }}>
        <PlayerProvider>
          <App />
        </PlayerProvider>
      </LibraryContext.Provider>
    </div>
  );
}

export default AppWithProviders;
