import { createContext, useReducer } from "react";

type PlayerState = {
  isPlaying: boolean;
  currentTrack?: {};
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Action = { type: string; payload: any };

const initialPlayerState: PlayerState = { isPlaying: false };

export const PlayerContext = createContext(initialPlayerState);
export const PlayerDispatchContext =
  createContext<React.Dispatch<Action> | null>(null);

const playerReducer: React.Reducer<PlayerState, Action> = (
  currentState,
  action,
) => {
  switch (action.type) {
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return action.payload;
    }
  }
};

export function PlayerProvider({ children }: { children: JSX.Element }) {
  const [playerState, dispatch] = useReducer(playerReducer, initialPlayerState);

  return (
    <PlayerContext.Provider value={playerState}>
      <PlayerDispatchContext.Provider value={dispatch}>
        {children}
      </PlayerDispatchContext.Provider>
    </PlayerContext.Provider>
  );
}
