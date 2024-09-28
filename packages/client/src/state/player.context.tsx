import { createContext, useEffect, useReducer } from "react";
import { PlayerStateSSEConnection } from "../api/client";
import {
  SoundSystemUpdate,
  SoundSystemUpdates,
} from "@record-collection/server";

export type PlayerContextState = {
  player: SoundSystemUpdate<"player">["payload"];
  queue: SoundSystemUpdate<"queue">["payload"];
};

const initialPlayerState: PlayerContextState = {
  player: {
    currentSong: {},
    status: {},
  },
  queue: {
    fullQueue: [],
    currentIndex: 0,
  },
};

export const PlayerContext = createContext(initialPlayerState);
export const PlayerDispatchContext =
  createContext<React.Dispatch<SoundSystemUpdates> | null>(null);

const playerReducer: React.Reducer<PlayerContextState, SoundSystemUpdates> = (
  currentState,
  action,
): PlayerContextState => {
  switch (action.type) {
    case "player":
      console.log("changing player state", { currentState, action });
      return {
        ...currentState,
        player: action.payload,
      };
    case "queue":
      return {
        ...currentState,
        queue: action.payload,
      };
    default: {
      return currentState;
    }
  }
};

export function PlayerProvider({ children }: { children: JSX.Element }) {
  const [playerState, dispatch] = useReducer(playerReducer, initialPlayerState);

  useEffect(() => {
    PlayerStateSSEConnection.addMessageHandler(dispatch);
  }, []);

  return (
    <PlayerContext.Provider value={playerState}>
      {children}
    </PlayerContext.Provider>
  );
}
